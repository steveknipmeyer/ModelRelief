// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {assert} from "chai";
import * as dat from "dat-gui";
import {StandardView} from "Scripts/Api/V1/Interfaces/ICamera";
import {Graphics, ObjectNames} from "Scripts/Graphics/Graphics";
import {BaseCamera} from "Scripts/Models/Camera/BaseCamera";
import {CameraFactory} from "Scripts/Models/Camera/CameraFactory";
import {CameraHelper} from "Scripts/Models/Camera/CameraHelper";
import {CameraSettings} from "Scripts/Models/Camera/Camerasettings";
import {ElementAttributes, ElementIds} from "Scripts/System/Html";
import * as THREE from "three";


/**
 * @description CameraControls
 * @class CameraControlSettings
 */
class CameraControlSettings {

    public camera: BaseCamera;
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

        this.fitView              = fitView;
        this.addCameraHelper      = addCameraHelper;
        this.boundClippingPlanes  = boundClippingPlanes;

        this.camera = camera;
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

    public viewer: any;                          // associated viewer
    public settings: CameraControlSettings;        // UI settings

    // The maximum and minimum values of these controls are modified by the boundClippingPlanes button so they are instance members.
    public _controlNearClippingPlane: dat.GUIController;
    public _controlFarClippingPlane: dat.GUIController;

    /**
     * Creates an instance of CameraControls.
     * @param {Viewer} viewer Associated viewer.
     * @param {ICameraControlsOptions} [controlOptions] Options to include/exclude specialized controls.
     */
    constructor(viewer: any, controlOptions?: ICameraControlsOptions) {

        this.viewer = viewer;

        // UI Controls
        this.initializeControls(controlOptions);
    }

//#region Event Handlers
    /**
     * @description Fits the active view.
     */
    public fitView(): void {

        this.viewer.fitView();
    }

    /**
     * @description Adds a camera visualization graphic to the scene.
     */
    public addCameraHelper(): void {

        // remove existing
        Graphics.removeAllByName(this.viewer.scene, ObjectNames.CameraHelper);

        assert.deepEqual(this.viewer.camera, this.settings.camera.viewCamera);

        // World
        Graphics.addCameraHelper(this.settings.camera.viewCamera, this.viewer.scene, this.viewer.modelGroup);

        // View
        const modelView = Graphics.cloneAndTransformObject(this.viewer.modelGroup, this.settings.camera.viewCamera.matrixWorldInverse);
        const cameraView = CameraHelper.getDefaultCamera(this.viewer.camera);
        Graphics.addCameraHelper(cameraView, this.viewer.scene, modelView);
    }

    /**
     * @description Force the far clipping plane to the model extents.
     */
    public boundClippingPlanes(): void {

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
    public initializeControls(controlOptions: ICameraControlsOptions = {}) {

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

        // Field of View
        if (showFieldOfView) {
            minimum = 25;
            maximum = 75;
            stepSize = 1;
            const controlFieldOfView = cameraOptions.add(this.settings.camera.viewCamera, "fov").name("Field of View").min(minimum).max(maximum).step(stepSize).listen();
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
            minimum  =   0.1;
            maximum  = CameraSettings.DefaultFarClippingPlane;
            stepSize =   0.1;
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

    /**
     * @description Synchronize the UI camera settings with the target camera.
     * @param {StandardView} [view] Standard view to set.
     */
    public synchronizeCameraSettings(view?: StandardView) {

        // update settings camera from view
        this.settings.camera.viewCamera = this.viewer.camera;
    }
}
