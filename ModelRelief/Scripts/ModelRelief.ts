// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'

import {DepthBufferFactory}     from "DepthBufferFactory"
import {Loader}                 from 'Loader'
import {Logger, ConsoleLogger}  from 'Logger'
import {Graphics}               from "Graphics"
import {MeshPreviewViewer}      from "MeshPreviewViewer"
import {ModelViewer}            from "ModelViewer"
import {OBJLoader}              from "OBJLoader"
import {Services}               from 'Services'
import {Viewer}                 from "Viewer"

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

        let size = 768;
        let factory = new DepthBufferFactory({width : size, height : size, model : this._modelViewer._root, camera : this._modelViewer.camera});   
        let previewMesh : THREE.Mesh = factory.meshGenerate({modelWidth : 2});

        this._meshPreviewViewer.model = previewMesh;
            
        Services.consoleLogger.addInfoMessage('Relief generated');
    }

    /**
     * Initialize the view settings that are controllable by the user
     */
    initializeViewerControls() {

        let scope = this;

        class ViewerControls {
            displayGrid: boolean;
            generateRelief : () => void;

            constructor() {
                this.displayGrid   = true;
                this.generateRelief = function() {};
            }
        }
        let viewerControls = new ViewerControls();

        // Init dat.gui and controls for the UI
        var gui = new dat.GUI({
            autoPlace: false,
            width: 320
        });
        var menuDiv = document.getElementById('settingsControls');
        menuDiv.appendChild(gui.domElement);
        var folderOptions = gui.addFolder('ModelViewer Options');

        // Grid
        var controlDisplayGrid = folderOptions.add(viewerControls, 'displayGrid').name('Display Grid');
        controlDisplayGrid.onChange (function (value) {

            scope._modelViewer.displayGrid (value);
        }.bind(this));

        // Depth Buffer
        var controlGenerateRelief = folderOptions.add(viewerControls, 'generateRelief').name('Generate Relief');
        controlGenerateRelief.onChange (function () {

            scope.generateRelief();
        }.bind(this));

        folderOptions.open();
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
//      this._loader.loadTorusModel (this._modelViewer);
//      this._loader.loadBoxModel (this._modelViewer);
//      this._loader.loadSphereModel (this._modelViewer);
    }
}

let modelRelief = new ModelRelief();
modelRelief.run();

