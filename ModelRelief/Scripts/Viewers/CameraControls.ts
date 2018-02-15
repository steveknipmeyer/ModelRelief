// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'

import {Camera, CameraSettings}                 from 'Camera'
import {CameraHelper }                          from 'CameraHelper'
import {ElementAttributes, ElementIds}          from "Html"
import {StandardView}                           from 'ICamera'
import {ILogger, ConsoleLogger}                 from 'Logger'
import {Graphics, ObjectNames}                  from "Graphics"
import {Services}                               from 'Services'
import {Viewer}                                 from "Viewer"

/**
 * @class
 * CameraControls
 */
class CameraControlSettings {

    cameraSettings          : CameraSettings;

    fitView                 : () => void;
    addCameraHelper         : () => void;
    boundClippingPlanes     : () => void;
    
    constructor(camera: THREE.PerspectiveCamera, fitView: () => any, addCwmeraHelper: () => any, boundClippingPlanes: () => any) {

        this.fitView              = fitView;
        this.addCameraHelper      = addCwmeraHelper;
        this.boundClippingPlanes  = boundClippingPlanes;
        
        this.cameraSettings = {

            position        : new THREE.Vector3(),  // not used in UI
            target          : new THREE.Vector3(),  // not used in UI
            near            : camera.near,
            far             : camera.far,
            fieldOfView     : camera.fov,
            
            standardView    : StandardView.Front
        }
    }
}

/**
 * camera UI Controls.
 */    
export class CameraControls {

    _viewer                   : Viewer;                     // associated viewer
    _cameraControlSettings    : CameraControlSettings;      // UI settings
    
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
        let cameraView = CameraHelper.getDefaultCamera(this._viewer.aspectRatio);
        Graphics.addCameraHelper(cameraView, this._viewer.scene, modelView);
    }

    /**
     * Force the far clipping plane to the model extents.
     */
    boundClippingPlanes(): void {

        let clippingPlanes = CameraHelper.getBoundingClippingPlanes(this._viewer.camera, this._viewer.model);

        // camera
        this._viewer.camera.near = clippingPlanes.near;
        this._viewer.camera.far  = clippingPlanes.far;
        this._viewer.camera.updateProjectionMatrix();

        // UI controls
        this._cameraControlSettings.cameraSettings.near = clippingPlanes.near;
        this._controlNearClippingPlane.min(clippingPlanes.near);
        this._controlNearClippingPlane.max (clippingPlanes.far);
        
        this._cameraControlSettings.cameraSettings.far = clippingPlanes.far;
        this._controlFarClippingPlane.min(clippingPlanes.near);
        this._controlFarClippingPlane.max(clippingPlanes.far);
    }
    //#endregion

    /**
     * Initialize the view settings that are controllable by the user
     */
    initializeControls() {

        let scope = this;

        this._cameraControlSettings = new CameraControlSettings(this._viewer.camera, this.fitView.bind(this), this.addCameraHelper.bind(this), this.boundClippingPlanes.bind(this));

        // Init dat.gui and controls for the UI
        let gui = new dat.GUI({
            autoPlace: false,
            width: ElementAttributes.DatGuiWidth
        });
        gui.domElement.id = ElementIds.CameraControls;

        let minimum     : number;
        let maximum     : number;
        let stepSize    : number;

        let containerDiv = document.getElementById(this._viewer.containerId);
        containerDiv.appendChild(gui.domElement);

        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        //                                                                     Camera                                                                   //      
        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        let cameraOptions = gui.addFolder('Camera Options');
        
        // Fit View
        let controlFitView = cameraOptions.add(this._cameraControlSettings, 'fitView').name('Fit View');

        // CameraHelper
        let controlCameraHelper = cameraOptions.add(this._cameraControlSettings, 'addCameraHelper').name('Camera Helper');
        
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

        let controlStandardViews = cameraOptions.add(this._cameraControlSettings.cameraSettings, 'standardView', viewOptions).name('Standard View').listen();
        controlStandardViews.onChange ((viewSetting : string) => {

            let view : StandardView = parseInt(viewSetting, 10);
            scope._viewer.setCameraToStandardView(view);
        });
            
        // Field of View
        minimum = 25;
        maximum = 75;
        stepSize = 1;
        let controlFieldOfView = cameraOptions.add(this._cameraControlSettings.cameraSettings, 'fieldOfView').name('Field of View').min(minimum).max(maximum).step(stepSize).listen();;
        controlFieldOfView.onChange(function (value) {

            scope._viewer.camera.fov = value;
            scope._viewer.camera.updateProjectionMatrix();
        }.bind(this));

        // Near Clipping Plane
        minimum  =   0.1;
        maximum  = 100;
        stepSize =   0.1;
        this._controlNearClippingPlane = cameraOptions.add(this._cameraControlSettings.cameraSettings, 'near').name('Near Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();
        this._controlNearClippingPlane.onChange (function (value) {

            scope._viewer.camera.near = value;
            scope._viewer.camera.updateProjectionMatrix();
        }.bind(this));

        // Far Clipping Plane
        minimum  =     1;
        maximum  = 10000;
        stepSize =     0.1;
        this._controlFarClippingPlane = cameraOptions.add(this._cameraControlSettings.cameraSettings, 'far').name('Far Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();
        this._controlFarClippingPlane.onChange (function (value) {

            scope._viewer.camera.far = value;
            scope._viewer.camera.updateProjectionMatrix();
        }.bind(this));

        // Bound Clipping Planes
        let controlBoundClippingPlanes = cameraOptions.add(this._cameraControlSettings, 'boundClippingPlanes').name('Bound Clipping Planes');
        
        cameraOptions.open();       
    }

    /**
     * Synchronize the UI camera settings with the target camera.
     * @param camera 
     */
    synchronizeCameraSettings (view? : StandardView) {

        if (view)
            this._cameraControlSettings.cameraSettings.standardView = view;
        
        this._cameraControlSettings.cameraSettings.near         = this._viewer.camera.near;
        this._cameraControlSettings.cameraSettings.far          = this._viewer.camera.far;
        this._cameraControlSettings.cameraSettings.fieldOfView  = this._viewer.camera.fov;
    }
}
