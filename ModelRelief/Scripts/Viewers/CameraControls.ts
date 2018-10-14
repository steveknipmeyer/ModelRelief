// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three'
import * as dat    from 'dat-gui'

import {assert}                                 from 'chai';
import {BaseCamera}                             from 'BaseCamera';
import {CameraHelper }                          from 'CameraHelper';
import {CameraSettings }                        from 'CameraSettings';
import {ElementAttributes, ElementIds}          from 'Html';
import {StandardView}                           from 'ICamera';
import {Graphics, ObjectNames}                  from 'Graphics';

/**
 * @description CameraControls
 * @class CameraControlSettings
 */
class CameraControlSettings {

    camera                  : BaseCamera;
    standardView            : StandardView = StandardView.Front;

    fitView                 : () => void;
    addCameraHelper         : () => void;
    boundClippingPlanes     : () => void;

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
export interface CameraControlsOptions {

    cameraHelper?     : boolean;
    fieldOfView?      : boolean;
    clippingControls? : boolean;
}

/**
 * @description Camera UI controls.
 * @export
 * @class CameraControls
 */
export class CameraControls {

    viewer      : any;                          // associated viewer
    settings    : CameraControlSettings;        // UI settings

    // The maximum and minimum values of these controls are modified by the boundClippingPlanes button so they are instance members.
    _controlNearClippingPlane : dat.GUIController;
    _controlFarClippingPlane  : dat.GUIController;

    /**
     * Creates an instance of CameraControls.
     * @param {Viewer} viewer Associated viewer.
     * @param {CameraControlsOptions} [controlOptions] Options to include/exclude specialized controls.
   */
    constructor(viewer : any, controlOptions? : CameraControlsOptions) {

        this.viewer = viewer;

        // UI Controls
        this.initializeControls(controlOptions);
    }

//#region Event Handlers
    /**
     * @description Fits the active view.
     */
    fitView() : void {

        this.viewer.fitView();
    }

    /**
     * @description Adds a camera visualization graphic to the scene.
     */
    addCameraHelper() : void {

        // remove existing
        Graphics.removeAllByName(this.viewer.scene, ObjectNames.CameraHelper);

        assert.deepEqual(this.viewer.camera, this.settings.camera.viewCamera);

        // World
        Graphics.addCameraHelper(this.settings.camera.viewCamera, this.viewer.scene, this.viewer.modelGroup);

        // View
        let modelView = Graphics.cloneAndTransformObject(this.viewer.modelGroup, this.settings.camera.viewCamera.matrixWorldInverse);
        let cameraView = CameraHelper.getDefaultCamera(this.viewer.camera);
        Graphics.addCameraHelper(cameraView, this.viewer.scene, modelView);
    }

    /**
     * @description Force the far clipping plane to the model extents.
     */
    boundClippingPlanes(): void {

        let clippingPlanes = this.settings.camera.getBoundingClippingPlanes(this.viewer.modelGroup);

        // camera
        this.settings.camera.viewCamera.near = clippingPlanes.near;
        this.settings.camera.viewCamera.far  = clippingPlanes.far;
        this.settings.camera.viewCamera.updateProjectionMatrix();

        // UI controls
        this._controlNearClippingPlane.setValue(clippingPlanes.near)
        this._controlFarClippingPlane.setValue(clippingPlanes.far)
    }
    //#endregion

    /**
     * @description Initialize the view settings that are controllable by the user
     * @param {CameraControlsOptions} [controlOptions] Options to include/exclude specialized controls.
     */
    initializeControls(controlOptions : CameraControlsOptions = {}) {

        let {
            cameraHelper     : showCameraHelper     = true,
            fieldOfView      : showFieldOfView      = true,
            clippingControls : showClippingControls = true,
        } = controlOptions;

        let scope = this;

        let camera = new BaseCamera({}, this.viewer.camera);
        this.settings = new CameraControlSettings(camera, this.fitView.bind(this), this.addCameraHelper.bind(this), this.boundClippingPlanes.bind(this));
        assert.deepEqual(this.viewer.camera, this.settings.camera.viewCamera);

        // Init dat.gui and controls for the UI
        let gui = new dat.GUI({
            autoPlace: false,
            width: ElementAttributes.DatGuiWidth
        });
        gui.domElement.id = ElementIds.CameraControls;

        let minimum     : number;
        let maximum     : number;
        let stepSize    : number;

        let containerDiv = document.getElementById(this.viewer.containerId);
        containerDiv.appendChild(gui.domElement);

        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        //                                                                     Camera                                                                   //
        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        let cameraOptions = gui.addFolder('Camera Options');

        // Fit View
        let controlFitView = cameraOptions.add(this.settings, 'fitView').name('Fit View');

        // CameraHelper
        if (showCameraHelper) {
            let controlCameraHelper = cameraOptions.add(this.settings, 'addCameraHelper').name('Camera Helper');
        }

        // Standard Views
        let viewOptions = {
            Front       : StandardView.Front,
            Back        : StandardView.Back,
            Top         : StandardView.Top,
            Isometric   : StandardView.Isometric,
            Left        : StandardView.Left,
            Right       : StandardView.Right,
            Bottom      : StandardView.Bottom
        };

        let controlStandardViews = cameraOptions.add(this.settings, 'standardView', viewOptions).name('Standard View').listen();
        controlStandardViews.onChange ((viewSetting : string) => {

            let view : StandardView = parseInt(viewSetting, 10);
            scope.viewer.setCameraToStandardView(view);
        });

        // Field of View
        if (showFieldOfView) {
            minimum = 25;
            maximum = 75;
            stepSize = 1;
            let controlFieldOfView = cameraOptions.add(this.settings.camera.viewCamera, 'fov').name('Field of View').min(minimum).max(maximum).step(stepSize).listen();
            controlFieldOfView.onChange(function (value) {
                if (scope.settings.camera.viewCamera instanceof THREE.PerspectiveCamera) {
                    scope.settings.camera.viewCamera.fov = value;
                    scope.settings.camera.viewCamera.updateProjectionMatrix();
                }
            }.bind(this));
        }

        // Clipping
        if (showClippingControls) {
            // Near Clipping Plane
            minimum  =   0.1;
            maximum  = CameraSettings.DefaultFarClippingPlane;
            stepSize =   0.1;
            this._controlNearClippingPlane = cameraOptions.add(this.settings.camera.viewCamera, 'near').name('Near Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();
            this._controlNearClippingPlane.onChange (function (value) {

                scope.settings.camera.viewCamera.near = value;
                scope.settings.camera.viewCamera.updateProjectionMatrix();
            }.bind(this));

            // Far Clipping Plane
            minimum  =  1;
            maximum  =  CameraSettings.DefaultFarClippingPlane;
            stepSize =  0.1;
            this._controlFarClippingPlane = cameraOptions.add(this.settings.camera.viewCamera, 'far').name('Far Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();
            this._controlFarClippingPlane.onChange (function (value) {

                scope.settings.camera.viewCamera.far = value;
                scope.settings.camera.viewCamera.updateProjectionMatrix();
            }.bind(this));

            // Bound Clipping Planes
            let controlBoundClippingPlanes = cameraOptions.add(this.settings, 'boundClippingPlanes').name('Bound Clipping Planes');
        }

        cameraOptions.open();
    }

    /**
     * @description Synchronize the UI camera settings with the target camera.
     * @param {StandardView} [view] Standard view to set.
     */
    synchronizeCameraSettings (view? : StandardView) {

        // update settings camera from view
        this.settings.camera.viewCamera = this.viewer.camera;
    }
}
