// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'

import {Camera, StandardView}       from 'Camera'
import {Logger, ConsoleLogger}      from 'Logger'
import {Graphics, ObjectNames}      from "Graphics"
import {Services}                   from 'Services'
import {Viewer}                     from "Viewer"

/**
 * @class
 * CameraControls
 */
class CameraSettings {

    fitView            : () => void;
    addCameraHelper    : () => void;
    
    standardView          : StandardView;
    fieldOfView: number   ;
    nearClippingPlane     : number;
    farClippingPlane      : number;
    boundClippingPlanes   : () => void;
    
    constructor(camera: THREE.PerspectiveCamera, fitView: () => any, addCwmeraHelper: () => any, boundClippingPlanes: () => any) {

        this.fitView         = fitView;
        this.addCameraHelper = addCwmeraHelper;
        
        this.standardView          = StandardView.Front;
        this.fieldOfView           = camera.fov;
        this.nearClippingPlane     = camera.near;
        this.farClippingPlane      = camera.far;
        this.boundClippingPlanes = boundClippingPlanes;
    }
}

/**
 * camera UI Controls.
 */    
export class CameraControls {

    _viewer                   : Viewer;                     // associated viewer
    _cameraSettings           : CameraSettings;             // UI settings
    _controlNearClippingPlane : dat.GUIController;
    _controlFarClippingPlane  : dat.GUIController;
    
    /** Default constructor
     * @class CameraControls
     * @constructor
     */
    constructor(viewer : Viewer) {  

        this._viewer = viewer;

        // UI Controls
        this.initializeControls();
    }

//#region Event Handlers
    /**
     * Fits the active view.
     */
    fitView() : void { 
        
        this._viewer.fitView();
    }

    /**
     * Adds a camera visualization graphic to the scene.
     */
    addCameraHelper() : void { 

        // remove existing
        Graphics.removeAllByName(this._viewer.scene, ObjectNames.CameraHelper);
        
        // World
        Graphics.addCameraHelper(this._viewer.camera, this._viewer.scene, this._viewer.model);

        // View
        let modelView = Graphics.cloneAndTransformObject(this._viewer.model, this._viewer.camera.matrixWorldInverse);
        let cameraView = Camera.getDefaultCamera(this._viewer.aspectRatio);
        Graphics.addCameraHelper(cameraView, this._viewer.scene, modelView);
    }

    /**
     * Force the far clipping plane to the model extents.
     */
    boundClippingPlanes(): void {

        let clippingPlanes = Camera.getBoundingClippingPlanes(this._viewer.camera, this._viewer.model);

        this._cameraSettings.nearClippingPlane = clippingPlanes.near;
        this._controlNearClippingPlane.min(clippingPlanes.near);
        this._controlNearClippingPlane.max (clippingPlanes.far);
        
        this._cameraSettings.farClippingPlane  = clippingPlanes.far;
        this._controlFarClippingPlane.min(clippingPlanes.near);
        this._controlFarClippingPlane.max(clippingPlanes.far);
    }
    //#endregion

    /**
     * Initialize the view settings that are controllable by the user
     */
    initializeControls() {

        let scope = this;

        this._cameraSettings = new CameraSettings(this._viewer.camera, this.fitView.bind(this), this.addCameraHelper.bind(this), this.boundClippingPlanes.bind(this));

        // Init dat.gui and controls for the UI
        let gui = new dat.GUI({
            autoPlace: false,
            width: 320
        });

        let menuDiv = document.getElementById(this._viewer.containerId);
        menuDiv.appendChild(gui.domElement);

        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        //                                                                     Camera                                                                   //      
        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        let cameraOptions = gui.addFolder('Camera Options');
        
        // Fit View
        let controlFitView = cameraOptions.add(this._cameraSettings, 'fitView').name('Fit View');

        // CameraHelper
        let controlCameraHelper = cameraOptions.add(this._cameraSettings, 'addCameraHelper').name('Camera Helper');
        
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

        let controlStandardViews = cameraOptions.add(this._cameraSettings, 'standardView', viewOptions).name('Standard View').listen();
        controlStandardViews.onChange ((viewSetting : string) => {

            let view : StandardView = parseInt(viewSetting, 10);
            scope._viewer.setCameraToStandardView(view);
        });

        // Field of View
        let minimum = 25;
        let maximum = 75;
        let stepSize = 1;
        let controlFieldOfView = cameraOptions.add(this._cameraSettings, 'fieldOfView').name('Field of View').min(minimum).max(maximum).step(stepSize).listen();;
        controlFieldOfView.onChange(function (value) {

            scope._viewer.camera.fov = value;
            scope._viewer.camera.updateProjectionMatrix();
        }.bind(this));

        // Near Clipping Plane
        minimum  =   0.1;
        maximum  = 100;
        stepSize =   0.1;
        this._controlNearClippingPlane = cameraOptions.add(this._cameraSettings, 'nearClippingPlane').name('Near Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();
        this._controlNearClippingPlane.onChange (function (value) {

            scope._viewer.camera.near = value;
            scope._viewer.camera.updateProjectionMatrix();
        }.bind(this));

        // Far Clipping Plane
        minimum  =     1;
        maximum  = 10000;
        stepSize =     0.1;
        this._controlFarClippingPlane = cameraOptions.add(this._cameraSettings, 'farClippingPlane').name('Far Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();
        this._controlFarClippingPlane.onChange (function (value) {

            scope._viewer.camera.far = value;
            scope._viewer.camera.updateProjectionMatrix();
        }.bind(this));

        // Bound Clipping Planes
        let controlBoundClippingPlanes = cameraOptions.add(this._cameraSettings, 'boundClippingPlanes').name('Bound Clipping Planes');
        
        cameraOptions.open();       
    }

    /**
     * Synchronize the UI camera settings with the target camera.
     * @param camera 
     */
    synchronizeCameraSettings (view? : StandardView) {

        if (view)
            this._cameraSettings.standardView = view;
        
        this._cameraSettings.nearClippingPlane = this._viewer.camera.near;
        this._cameraSettings.farClippingPlane  = this._viewer.camera.far;
        this._cameraSettings.fieldOfView       = this._viewer.camera.fov;
    }
}
