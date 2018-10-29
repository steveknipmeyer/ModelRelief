// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as dat from "dat-gui";
import * as THREE from "three";

import {assert} from "chai";
import {StandardView} from "Scripts/Api/V1/Interfaces/ICamera";
import {Graphics, ObjectNames} from "Scripts/Graphics/Graphics";
import {IThreeBaseCamera} from "Scripts/Graphics/IThreeBaseCamera";
import {BaseCamera} from "Scripts/Models/Camera/BaseCamera";
import {CameraFactory} from "Scripts/Models/Camera/CameraFactory";
import {CameraHelper} from "Scripts/Models/Camera/CameraHelper";
import {CameraSettings} from "Scripts/Models/Camera/Camerasettings";
import {EventType, IMREvent} from "Scripts/System/EventManager";
import {ElementAttributes, ElementIds} from "Scripts/System/Html";
import {Viewer} from "Scripts/Viewers/Viewer";

/**
 * @description CameraControls
 * @class CameraControlsSettings
 */
class CameraControlsSettings {

    public near: number;
    public far: number;
    public isPerspective: boolean;
    public fieldOfView: number;

    public standardView: StandardView = StandardView.Front;

    /**
     * Creates an instance of CameraControlsSettings.
     * @param {Camera} camera Perspective camera.
     */
    constructor(camera: THREE.Camera) {

        const baseCamera: IThreeBaseCamera = camera as IThreeBaseCamera;

        this.near = baseCamera.near;
        this.far = baseCamera.far;
        this.isPerspective  = camera instanceof THREE.PerspectiveCamera;
        this.fieldOfView    = this.isPerspective ? (camera as THREE.PerspectiveCamera).fov : CameraSettings.DefaultFieldOfView;

        this.standardView = StandardView.None;
    }
}
/**
 * @description Options to expose camera settings controls.
 * @export
 * @interface CameraControlsOptions
 */
export interface ICameraControlsOptions {

    cameraHelper?: boolean;
    fieldOfView?: boolean;
    clippingControls?: boolean;
}

/**
 * @description Camera UI controls.
 * @export
 * @class CameraControls
 */
export class CameraControls {

    public viewer: Viewer;                          // associated viewer
    public settings: CameraControlsSettings;         // UI settings

    // The maximum and minimum values of these controls are modified by the boundClippingPlanes button so theses controls are instance members.
    private _controllerNearClippingPlane: dat.GUIController;
    private _controllerFarClippingPlane: dat.GUIController;

    /**
     * Creates an instance of CameraControls.
     * @param {Viewer} viewer Associated viewer.
     * @param {ICameraControlsOptions} [controlOptions] Options to include/exclude specialized controls.
     */
    constructor(viewer: Viewer, controlOptions?: ICameraControlsOptions) {

        this.viewer = viewer;

        // UI Controls
        this.initializeControls(controlOptions);

        // Events
        this.initializeViewerEventListeners();
    }

//#region Event Handlers
    /**
     * @description Initialize event listeners for controlled Viewer.
     * @private
     */
    private initializeViewerEventListeners(): void {

        // Camera
        this.viewer.eventManager.addEventListener(EventType.ViewerCameraProperties, (event: IMREvent, camera: IThreeBaseCamera) => {
            this.synchronizeSettingsFromViewCamera(camera);
            });

        // Camera Standard View
        this.viewer.eventManager.addEventListener(EventType.ViewerCameraStandardView, (event: IMREvent, standardView: StandardView) => {
            this.settings.standardView = standardView;
        });
        }

    /**
     * @description Fits the active view.
     */
    private fitView(): void {

        this.viewer.fitView();
    }

    /**
     * @description Adds a camera visualization graphic to the scene.
     */
    private addCameraHelper(): void {

        // remove existing
        Graphics.removeAllByName(this.viewer.scene, ObjectNames.CameraHelper);

        // World
        Graphics.addCameraHelper(this.viewer.camera, this.viewer.scene, this.viewer.modelGroup);

        // View
        const modelView = Graphics.cloneAndTransformObject(this.viewer.modelGroup, this.viewer.camera.matrixWorldInverse);
        const cameraView = CameraHelper.getDefaultCamera(this.viewer.aspectRatio, this.viewer.camera instanceof THREE.PerspectiveCamera);
        Graphics.addCameraHelper(cameraView, this.viewer.scene, modelView);
    }

    /**
     * @description Force the far clipping plane to the model extents.
     */
    private boundClippingPlanes(): void {

        const baseCamera: BaseCamera = CameraFactory.constructFromViewCamera({}, this.viewer.camera);
        const clippingPlanes = baseCamera.getBoundingClippingPlanes(this.viewer.modelGroup);

        // camera
        this.viewer.camera.near = clippingPlanes.near;
        this.viewer.camera.far  = clippingPlanes.far;
        this.viewer.camera.updateProjectionMatrix();

        // UI controls
        this._controllerNearClippingPlane.setValue(clippingPlanes.near);
        this._controllerFarClippingPlane.setValue(clippingPlanes.far);
    }
//#endregion

    /**
     * @description Initialize the view settings that are controllable by the user
     * @param {ICameraControlsOptions} [controlOptions] Options to include/exclude specialized controls.
     */
    private initializeControls(controlOptions: ICameraControlsOptions = {}) {

        const {
            cameraHelper     : showCameraHelper     = true,
            fieldOfView      : showFieldOfView      = true,
            clippingControls : showClippingControls = true,
        } = controlOptions;

        const scope = this;
        this.settings = new CameraControlsSettings(this.viewer.camera);

        // Init dat.gui and controls for the UI
        const gui = new dat.GUI({
            autoPlace: false,
            width: ElementAttributes.DatGuiWidth,
        });
        gui.domElement.id = ElementIds.CameraControls;

        let minimum: number;
        let maximum: number;
        let stepSize: number;

        const containerDiv = document.getElementById(this.viewer.containerId);
        containerDiv.appendChild(gui.domElement);

        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        //                                                                     Camera                                                                   //
        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        const cameraOptions = gui.addFolder("Camera Options");

        // Standard Views
        const viewOptions = {
            None        : StandardView.None,
            Front       : StandardView.Front,
            Back        : StandardView.Back,
            Top         : StandardView.Top,
            Isometric   : StandardView.Isometric,
            Left        : StandardView.Left,
            Right       : StandardView.Right,
            Bottom      : StandardView.Bottom,
        };
        const controlStandardViews = cameraOptions.add(this.settings, "standardView", viewOptions).name("Standard View").listen();
        controlStandardViews.onChange ((viewSetting: string) => {

            const view: StandardView = parseInt(viewSetting, 10);
            scope.viewer.setCameraToStandardView(view);
        });

        // Fit View
        const controlFitView = cameraOptions.add(this, "fitView").name("Fit View");

        // Clipping
        if (showClippingControls) {
            // Near Clipping Plane
            minimum  =  0.1;
            maximum  =  CameraSettings.DefaultFarClippingPlane;
            stepSize =  0.1;
            this._controllerNearClippingPlane = cameraOptions.add(this.settings, "near").name("Near Clipping Plane").min(minimum).max(maximum).step(stepSize).listen();
            this._controllerNearClippingPlane.onChange ((value) => {

                scope.viewer.camera.near = value;
                scope.viewer.camera.updateProjectionMatrix();
            });

            // Far Clipping Plane
            minimum  =  1;
            maximum  =  CameraSettings.DefaultFarClippingPlane;
            stepSize =  0.1;
            this._controllerFarClippingPlane = cameraOptions.add(this.settings, "far").name("Far Clipping Plane").min(minimum).max(maximum).step(stepSize).listen();
            this._controllerFarClippingPlane.onChange ((value) => {

                scope.viewer.camera.far = value;
                scope.viewer.camera.updateProjectionMatrix();
            });

            // Bound Clipping Planes
            const controlBoundClippingPlanes = cameraOptions.add(this, "boundClippingPlanes").name("Bound Clipping Planes");
        }

        // CameraHelper
        if (showCameraHelper) {
            const controlCameraHelper = cameraOptions.add(this, "addCameraHelper").name("Camera Helper");
        }

        // Perspective
        const perspectiveCameraControl = cameraOptions.add(this.settings, "isPerspective").name("Perspective").listen();
        perspectiveCameraControl.onChange((value) => {

            // toggle projection
            const newCamera: IThreeBaseCamera = CameraFactory.constructViewCameraOppositeProjection(this.viewer.camera);

            // update Viewer
            this.viewer.camera = newCamera;

            // synchronize UI settings
            this.synchronizeSettingsFromViewCamera(newCamera);
        });

        // Field of View
        if (showFieldOfView) {
            minimum = 25;
            maximum = 75;
            stepSize = 1;
            const controlFieldOfView = cameraOptions.add(this.settings, "fieldOfView").name("Field of View").min(minimum).max(maximum).step(stepSize).listen();
            controlFieldOfView.onChange((value) => {
                if (scope.viewer.camera instanceof THREE.PerspectiveCamera) {
                    scope.viewer.camera.fov = value;
                    scope.viewer.camera.updateProjectionMatrix();
                }
            });
        }
        cameraOptions.open();
    }

    private synchronizeSettingsFromViewCamera(camera: IThreeBaseCamera): void {

        this.settings.near = camera.near;
        this.settings.far = camera.far;
        this.settings.isPerspective = camera instanceof THREE.PerspectiveCamera;

        if (this.settings.isPerspective) {
            const perspectiveCamera = camera as THREE.PerspectiveCamera;
            this.settings.fieldOfView = perspectiveCamera.fov;
        }

        this.settings.standardView = StandardView.None;
    }
}
