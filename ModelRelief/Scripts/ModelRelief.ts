// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'

import {Logger, ConsoleLogger}  from 'Logger'
import {DepthBufferFactory}     from "DepthBufferFactory"
import {Graphics}               from "Graphics"
import {OBJLoader}              from "OBJLoader"
import {MeshPreviewViewer}      from "MeshPreviewViewer"
import {Services}               from 'Services'
import {Viewer}                 from "Viewer"

export class ModelRelief {

    _modelViewer        : Viewer;
    _meshPreviewViewer  : MeshPreviewViewer;

    /** Default constructor
     * @class ModelRelief
     * @constructor
     */
    constructor() {  
    }

    /**
     * Loads a model based on the model name and path embedded in the HTML page.
     * @param viewer Instance of the Viewer to display the model
     */    
    loadModel (viewer : Viewer) {

        let modelNameElement : HTMLElement = window.document.getElementById('modelName');
        let modelPathElement : HTMLElement = window.document.getElementById('modelPath');

        let modelName    : string = modelNameElement.textContent;
        let modelPath    : string = modelPathElement.textContent;
        let fileName     : string = modelPath + modelName;

        let manager = new THREE.LoadingManager();
        let loader  = new OBJLoader(manager);
        
        let onProgress = function (xhr) {

            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log(percentComplete.toFixed(2) + '% downloaded');
            }
        };

        let onError = function (xhr) {
        };        

        loader.load(fileName, function (group : THREE.Group) {
            
            viewer.model = group;

        }, onProgress, onError);
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
        this._modelViewer = new Viewer('modelCanvas');
        this.loadModel (this._modelViewer);
        
        // Mesh Preview
        this._meshPreviewViewer =  new MeshPreviewViewer('meshCanvas');

        // UI Controls
        this.initializeViewerControls();
    }
}

let modelRelief = new ModelRelief();
modelRelief.run();

