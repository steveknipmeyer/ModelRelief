// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'

import {StandardView}               from "Camera"
import {DepthBufferFactory}         from "DepthBufferFactory"
import {Loader}                     from 'Loader'
import {Logger, ConsoleLogger}      from 'Logger'
import {Graphics}                   from "Graphics"
import {MeshPreviewViewer}          from "MeshPreviewViewer"
import {ModelViewer}                from "ModelViewer"
import {OBJLoader}                  from "OBJLoader"
import {Services}                   from 'Services'
import {TestModel}                  from 'TestModelLoader'
import {Viewer}                     from "Viewer"

/**
 * @class
 * ViewerControls
 */
class ModelViewerSettings {

    displayGrid    : boolean;
    generateRelief : () => void;

    nearClippingPlane  : number;
    farClippingPlane   : number;
    fieldOfView        : number;
    
    constructor(camera: THREE.PerspectiveCamera, generateRelief : () => any) {
        
        this.displayGrid    = true; 
        this.generateRelief = generateRelief;

        this.nearClippingPlane    = camera.near;
        this.farClippingPlane     = camera.far;
        this.fieldOfView          = camera.fov;
    }
}

/**
 * ModelViewer UI Controls.
 */    
export class ModelViewerControls {

    static ContainerId   : string = 'modelContainer';

    _modelViewer         : ModelViewer;                     // associated viewer
    _modelViewerSettings : ModelViewerSettings;             // UI settings

    /** Default constructor
     * @class ModelViewerControls
     * @constructor
     */
    constructor(modelViewer : ModelViewer) {  

        this._modelViewer = modelViewer;

        // UI Controls
        this.initializeControls();
    }

    /**
     * Generates a relief from the current model camera.
     */
    generateRelief() : void { 

        this._modelViewer.generateRelief();
    }

    /**
     * Initialize the view settings that are controllable by the user
     */
    initializeControls() {

        let scope = this;

        this._modelViewerSettings = new ModelViewerSettings(this._modelViewer.camera, this.generateRelief.bind(this));

        // Init dat.gui and controls for the UI
        let gui = new dat.GUI({
            autoPlace: false,
            width: 320
        });
        let menuDiv = document.getElementById(ModelViewerControls.ContainerId);
        menuDiv.appendChild(gui.domElement);

        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        //                                                                   ModelViewer                                                                //      
        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        let modelViewerOptions = gui.addFolder('ModelViewer Options');

        // Grid
        let controlDisplayGrid = modelViewerOptions.add(this._modelViewerSettings, 'displayGrid').name('Display Grid');
        controlDisplayGrid.onChange ((value : boolean) => {

            scope._modelViewer.displayGrid(value);
        });

        // Generate Relief
        let controlGenerateRelief = modelViewerOptions.add(this._modelViewerSettings, 'generateRelief').name('Generate Relief');

        modelViewerOptions.open();

        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        //                                                                     Camera                                                                   //      
        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        let cameraOptions = gui.addFolder('Camera Options');
        
        // Near Clipping Plane
        let minimum  =   0.1;
        let maximum  = 100;
        let stepSize =   0.1;
        let controlNearClippingPlane = cameraOptions.add(this._modelViewerSettings, 'nearClippingPlane').name('Near Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();
        controlNearClippingPlane.onChange (function (value) {

            scope._modelViewer.camera.near = value;
            scope._modelViewer.camera.updateProjectionMatrix();
        }.bind(this));

        // Far Clipping Plane
        minimum  =     1;
        maximum  = 10000;
        stepSize =     0.1;
        let controlFarClippingPlane = cameraOptions.add(this._modelViewerSettings, 'farClippingPlane').name('Far Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();;
        controlFarClippingPlane.onChange (function (value) {

            scope._modelViewer.camera.far = value;
            scope._modelViewer.camera.updateProjectionMatrix();
        }.bind(this));

        // Field of View
        minimum  = 25;
        maximum  = 75;
        stepSize =  1;
        let controlFieldOfView= cameraOptions.add(this._modelViewerSettings, 'fieldOfView').name('Field of View').min(minimum).max(maximum).step(stepSize).listen();;
        controlFieldOfView .onChange (function (value) {

            scope._modelViewer.camera.fov = value;
            scope._modelViewer.camera.updateProjectionMatrix();
        }.bind(this));

        cameraOptions.open();       
    }

    /**
     * Synchronize the UI camera settings with the target camera.
     * @param camera 
     */
    synchronizeCameraSettings (camera : THREE.PerspectiveCamera) {

        this._modelViewerSettings.nearClippingPlane = camera.near;
        this._modelViewerSettings.farClippingPlane  = camera.far;
        this._modelViewerSettings.fieldOfView       = camera.fov;
    }
}
