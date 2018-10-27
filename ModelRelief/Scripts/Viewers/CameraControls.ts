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
 * @class CameraControlSettings
 */
class CameraControlSettings {

    public camera: BaseCamera;

    // A BaseCamera does not implement a setter for isPerspective to avoid circular dependencies (e.g. Camera <-> CameraFactory).
    // So, the camera type is maintained as a CameraControls instance member. The onChange method handles the conversion of the underlying BaseCamera.
    public isPerspective: boolean;

    // The FOV control exposed for both Perspective and Orthographic cameras.
    // Only Perspective cameras have a setting (fov) so the setting holds the value rather than the active camera
    public fieldOfView: number;

    public standardView: StandardView = StandardView.Front;

    public fitView: () => void;
    public addCameraHelper: () => void;
    public boundClippingPlanes: () => void;

    /**
     * Creates an instance of CameraControlSettings.
     * @param {Camera} camera Perspective camera.
     * @param {() => any} fitView Function to perform Fit View.
     * @param {() => any} addCameraHelper Function to add CameraHelper to scene.
     * @param {() => any} boundClippingPlanes Function to set clipping planes to extents of model.
     */
    constructor(camera: BaseCamera, fitView: () => any, addCameraHelper: () => any, boundClippingPlanes: () => any) {

        this.camera               = camera;
        this.isPerspective        = camera.isPerspective;
        this.fieldOfView          = camera.isPerspective ? (camera.viewCamera as THREE.PerspectiveCamera).fov : CameraSettings.DefaultFieldOfView;

        this.fitView              = fitView;
        this.addCameraHelper      = addCameraHelper;
        this.boundClippingPlanes  = boundClippingPlanes;
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
    public settings: CameraControlSettings;         // UI settings

    // The maximum and minimum values of these controls are modified by the boundClippingPlanes button so theses controls are instance members.
    private _controlNearClippingPlane: dat.GUIController;
    private _controlFarClippingPlane: dat.GUIController;

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

        // Camera Properties
        this.viewer.eventManager.addEventListener(EventType.ViewerCameraProperties, (event: IMREvent, camera: IThreeBaseCamera) => {
            this.settings.camera.viewCamera = camera;
            this.settings.isPerspective = camera instanceof THREE.PerspectiveCamera;
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

        assert.deepEqual(this.viewer.camera, this.settings.camera.viewCamera);

        // World
        Graphics.addCameraHelper(this.settings.camera.viewCamera, this.viewer.scene, this.viewer.modelGroup);

        // View
        const modelView = Graphics.cloneAndTransformObject(this.viewer.modelGroup, this.settings.camera.viewCamera.matrixWorldInverse);
        const cameraView = CameraHelper.getDefaultCamera(this.viewer.aspectRatio, this.viewer.camera instanceof THREE.PerspectiveCamera);
        Graphics.addCameraHelper(cameraView, this.viewer.scene, modelView);
    }

    /**
     * @description Force the far clipping plane to the model extents.
     */
    private boundClippingPlanes(): void {

        const clippingPlanes = this.settings.camera.getBoundingClippingPlanes(this.viewer.modelGroup);

        // camera
        this.settings.camera.viewCamera.near = clippingPlanes.near;
        this.settings.camera.viewCamera.far  = clippingPlanes.far;
        this.settings.camera.viewCamera.updateProjectionMatrix();

        // UI controls
        this._controlNearClippingPlane.setValue(clippingPlanes.near);
        this._controlFarClippingPlane.setValue(clippingPlanes.far);
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

        const parameters = {};
        const camera = CameraFactory.ConstructFromViewCamera(parameters, this.viewer.camera);

        this.settings = new CameraControlSettings(camera, this.fitView.bind(this), this.addCameraHelper.bind(this), this.boundClippingPlanes.bind(this));
        assert.deepEqual(this.viewer.camera, this.settings.camera.viewCamera);

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

        // Fit View
        const controlFitView = cameraOptions.add(this.settings, "fitView").name("Fit View");

        // CameraHelper
        if (showCameraHelper) {
            const controlCameraHelper = cameraOptions.add(this.settings, "addCameraHelper").name("Camera Helper");
        }

        // Standard Views
        const viewOptions = {
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

        // Perspective
        const perspectiveCameraControl = cameraOptions.add(this.settings, "isPerspective").name("Perspective").listen();
        perspectiveCameraControl.onChange((value) => {

            const existingCamera: BaseCamera  = CameraFactory.ConstructFromViewCamera({}, this.viewer.camera);
            const newDtoCamera = existingCamera.toDtoModel();
            newDtoCamera.isPerspective = !newDtoCamera.isPerspective;
            const newCamera = newDtoCamera.getViewCamera();

            if (scope.settings.isPerspective) {
                // Orthographic -> Perspective
            } else {
                // Perspective -> Orthographic
                const orthograpicCamera = newCamera as THREE.OrthographicCamera;

                orthograpicCamera.zoom = 1;

                // extents of existing Perspective camera clipping planes will define Orthographic camera boundary
                const farPlaneExtents = existingCamera.getFarPlaneExtents();
                orthograpicCamera.left   = -farPlaneExtents.x / 2;
                orthograpicCamera.right  = +farPlaneExtents.x / 2;
                orthograpicCamera.top    = +farPlaneExtents.y / 2;
                orthograpicCamera.bottom = -farPlaneExtents.y / 2;
            }
            newCamera.updateProjectionMatrix();
            this.viewer.camera = newCamera;

            // synchronize UI settings
            this.settings.camera.viewCamera = newCamera;
            if (this.settings.isPerspective) {
                const perspectiveCamera = newCamera as THREE.PerspectiveCamera;
                this.settings.fieldOfView = perspectiveCamera.fov;
            }
        });

        // Field of View
        if (showFieldOfView) {
            minimum = 25;
            maximum = 75;
            stepSize = 1;
            const controlFieldOfView = cameraOptions.add(this.settings, "fieldOfView").name("Field of View").min(minimum).max(maximum).step(stepSize).listen();
            controlFieldOfView.onChange((value) => {
                if (scope.settings.camera.viewCamera instanceof THREE.PerspectiveCamera) {
                    scope.settings.camera.viewCamera.fov = value;
                    scope.settings.camera.viewCamera.updateProjectionMatrix();
                }
            });
        }

        // Clipping
        if (showClippingControls) {
            // Near Clipping Plane
            minimum  =  0.1;
            maximum  =  CameraSettings.DefaultFarClippingPlane;
            stepSize =  0.1;
            this._controlNearClippingPlane = cameraOptions.add(this.settings.camera.viewCamera, "near").name("Near Clipping Plane").min(minimum).max(maximum).step(stepSize).listen();
            this._controlNearClippingPlane.onChange ((value) => {

                scope.settings.camera.viewCamera.near = value;
                scope.settings.camera.viewCamera.updateProjectionMatrix();
            });

            // Far Clipping Plane
            minimum  =  1;
            maximum  =  CameraSettings.DefaultFarClippingPlane;
            stepSize =  0.1;
            this._controlFarClippingPlane = cameraOptions.add(this.settings.camera.viewCamera, "far").name("Far Clipping Plane").min(minimum).max(maximum).step(stepSize).listen();
            this._controlFarClippingPlane.onChange ((value) => {

                scope.settings.camera.viewCamera.far = value;
                scope.settings.camera.viewCamera.updateProjectionMatrix();
            });

            // Bound Clipping Planes
            const controlBoundClippingPlanes = cameraOptions.add(this.settings, "boundClippingPlanes").name("Bound Clipping Planes");
        }

        cameraOptions.open();
    }
}
