// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'

import {StandardView}               from "Camera"
import {Logger, ConsoleLogger}      from 'Logger'
import {Graphics}                   from "Graphics"
import {Services}                   from 'Services'
import {Viewer}                     from "Viewer"

/**
 * @class
 * CameraControls
 */
class CameraSettings {

    fitView            : () => void;
    
    standardView       : StandardView;
    nearClippingPlane  : number;
    farClippingPlane   : number;
    fieldOfView        : number;
    
    constructor(camera: THREE.PerspectiveCamera, fitView : () => any) {

        this.fitView = fitView;
        
        this.standardView      = StandardView.Front;
        this.nearClippingPlane = camera.near;
        this.farClippingPlane  = camera.far;
        this.fieldOfView       = camera.fov;
    }
}

/**
 * camera UI Controls.
 */    
export class CameraControls {

    _viewer         : Viewer;                     // associated viewer
    _cameraSettings : CameraSettings;             // UI settings

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
    //#endregion

    /**
     * Initialize the view settings that are controllable by the user
     */
    initializeControls() {

        let scope = this;

        this._cameraSettings = new CameraSettings(this._viewer.camera, this.fitView.bind(this));

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
        
        // Generate Relief
        let controlFitView = cameraOptions.add(this._cameraSettings, 'fitView').name('Fit View');

        // Standard Views
        let viewOptions = {
            Front   : StandardView.Front,
            Back    : StandardView.Back,
            Top     : StandardView.Top,
            Iso     : StandardView.Isometric,
            Left    : StandardView.Left,
            Right   : StandardView.Right,
            Bottom  : StandardView.Bottom
        };

        let controlStandardViews = cameraOptions.add(this._cameraSettings, 'standardView', viewOptions).name('Standard View');
        controlStandardViews.onChange ((viewSetting : string) => {

            let view : StandardView = parseInt(viewSetting, 10);
            scope._viewer.setCameraToStandardView(view);
        });

        // Near Clipping Plane
        let minimum  =   0.1;
        let maximum  = 100;
        let stepSize =   0.1;
        let controlNearClippingPlane = cameraOptions.add(this._cameraSettings, 'nearClippingPlane').name('Near Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();
        controlNearClippingPlane.onChange (function (value) {

            scope._viewer.camera.near = value;
            scope._viewer.camera.updateProjectionMatrix();
        }.bind(this));

        // Far Clipping Plane
        minimum  =     1;
        maximum  = 10000;
        stepSize =     0.1;
        let controlFarClippingPlane = cameraOptions.add(this._cameraSettings, 'farClippingPlane').name('Far Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();;
        controlFarClippingPlane.onChange (function (value) {

            scope._viewer.camera.far = value;
            scope._viewer.camera.updateProjectionMatrix();
        }.bind(this));

        // Field of View
        minimum  = 25;
        maximum  = 75;
        stepSize =  1;
        let controlFieldOfView= cameraOptions.add(this._cameraSettings, 'fieldOfView').name('Field of View').min(minimum).max(maximum).step(stepSize).listen();;
        controlFieldOfView .onChange (function (value) {

            scope._viewer.camera.fov = value;
            scope._viewer.camera.updateProjectionMatrix();
        }.bind(this));

        cameraOptions.open();       
    }

    /**
     * Synchronize the UI camera settings with the target camera.
     * @param camera 
     */
    synchronizeCameraSettings () {

        this._cameraSettings.nearClippingPlane = this._viewer.camera.near;
        this._cameraSettings.farClippingPlane  = this._viewer.camera.far;
        this._cameraSettings.fieldOfView       = this._viewer.camera.fov;
    }
}
