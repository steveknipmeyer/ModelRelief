// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'

import {StandardView}           from "Camera"
import {DepthBufferFactory}     from "DepthBufferFactory"
import {Loader}                 from 'Loader'
import {Logger, ConsoleLogger}  from 'Logger'
import {Graphics}               from "Graphics"
import {MeshPreviewViewer}      from "MeshPreviewViewer"
import {ModelViewer}            from "ModelViewer"
import {OBJLoader}              from "OBJLoader"
import {Services}               from 'Services'
import {Viewer}                 from "Viewer"

/**
 * @class
 * ViewerControls
 */
class ViewerControls {

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
    
    export class ModelRelief {

    _loader             : Loader;
    _modelViewer        : ModelViewer;
    _meshPreviewViewer  : MeshPreviewViewer;

    /** Default constructor
     * @class ModelRelief
     * @constructor
     */
    constructor() {  
    }

    /**
     * Generates a relief from the current model camera.
     */
    generateRelief() : void {

        // pixels
        let width  = 512;
        let height = width / this._modelViewer.aspectRatio;
        let factory = new DepthBufferFactory({width : width, height : height, model : this._modelViewer._root, camera : this._modelViewer.camera, addCanvasToDOM : true});   

        // mesh units
        let meshWidth = 2;
        let meshXYExtents = new THREE.Vector2(meshWidth, meshWidth / this._modelViewer.aspectRatio);
        let previewMesh : THREE.Mesh = factory.meshGenerate({meshXYExtents : meshXYExtents});

        this._meshPreviewViewer.model = previewMesh;
            
        Services.consoleLogger.addInfoMessage('Relief generated');
    }

    /**
     * Initialize the view settings that are controllable by the user
     */
    initializeViewerControls() {

        let scope = this;

        let viewerControls = new ViewerControls(this._modelViewer.camera, this.generateRelief.bind(this));

        // Init dat.gui and controls for the UI
        let gui = new dat.GUI({
            autoPlace: false,
            width: 320
        });
        let menuDiv = document.getElementById('settingsControls');
        menuDiv.appendChild(gui.domElement);

        // ----------------------//
        //    ModelViewer        //      
        // ----------------------//
        let modelViewerOptions = gui.addFolder('ModelViewer Options');

        // Grid
        let controlDisplayGrid = modelViewerOptions.add(viewerControls, 'displayGrid').name('Display Grid');
        controlDisplayGrid.onChange ((value : boolean) => {

            scope._modelViewer.displayGrid(value);
        });

        // Depth Buffer
        let controlGenerateRelief = modelViewerOptions.add(viewerControls, 'generateRelief').name('Generate Relief');

        modelViewerOptions.open();

        // ----------------------//
        //        Camera         //      
        // ----------------------//
        let cameraOptions = gui.addFolder('Camera Options');
        
        // Near Clipping Plane
        let minimum  =   0.1;
        let maximum  = 100;
        let stepSize =   0.1;
        let controlNearClippingPlane = cameraOptions.add(viewerControls, 'nearClippingPlane').name('Near Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();
        controlNearClippingPlane.onChange (function (value) {

            scope._modelViewer.camera.near = value;
            scope._modelViewer.camera.updateProjectionMatrix();
        }.bind(this));

        // Far Clipping Plane
        minimum  =     1;
        maximum  = 10000;
        stepSize =     0.1;
        let controlFarClippingPlane = cameraOptions.add(viewerControls, 'farClippingPlane').name('Far Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();;
        controlFarClippingPlane.onChange (function (value) {

            scope._modelViewer.camera.far = value;
            scope._modelViewer.camera.updateProjectionMatrix();
        }.bind(this));

        // Field of View
        minimum  = 25;
        maximum  = 75;
        stepSize =  1;
        let controlFieldOfView= cameraOptions.add(viewerControls, 'fieldOfView').name('Field of View').min(minimum).max(maximum).step(stepSize).listen();;
        controlFieldOfView .onChange (function (value) {

            scope._modelViewer.camera.fov = value;
            scope._modelViewer.camera.updateProjectionMatrix();
        }.bind(this));

        cameraOptions.open();       
    }

    /**
     * Launch the model Viewer.
     */
    run () {

        Services.consoleLogger.addInfoMessage ('ModelRelief started');   
       
        // Model Viewer    
        this._modelViewer = new ModelViewer('modelCanvas');
        
        // Mesh Preview
        this._meshPreviewViewer =  new MeshPreviewViewer('meshCanvas');

        // UI Controls
        this.initializeViewerControls();

        // Loader
        this._loader = new Loader();

        this._loader.loadOBJModel (this._modelViewer);

        // Test Models
//      this._loader.loadCheckerboardModel (this._modelViewer);
//      this._loader.loadTorusModel (this._modelViewer);
//      this._loader.loadBoxModel (this._modelViewer);
//      this._loader.loadSlopedPlaneModel (this._modelViewer);
//      this._loader.loadSphereModel (this._modelViewer);           
        this._modelViewer.setCameraToStandardView(StandardView.Front);
    }
}

let modelRelief = new ModelRelief();
modelRelief.run();

