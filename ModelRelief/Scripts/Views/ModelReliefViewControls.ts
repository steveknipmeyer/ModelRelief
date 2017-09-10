// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'

import {DepthBufferFactory}         from "DepthBufferFactory"
import {Logger, ConsoleLogger}      from 'Logger'
import {Graphics}                   from "Graphics"
import {ModelReliefView}            from "ModelReliefView"
import {ModelViewer}                from "ModelViewer"
import { OBJExporter } from "OBJExporter"
import {Services}                   from 'Services'

/**
 * @class
 * ModelReliefView Settings
 */
class ModelReliefViewSettings {

    generateRelief : () => void;
    saveRelief     : () => void;

    constructor(generateRelief: () => any, saveRelief: () => any) {
        
        this.generateRelief = generateRelief;
        this.saveRelief     = saveRelief;
    }
}

/**
 * ModelReliefView UI Controls.
 */    
export class ModelReliefViewControls {

    _modelReliefView         : ModelReliefView;                      // application view
    _modelReliefViewSettings : ModelReliefViewSettings;               // UI settings

    _initialMeshGeneration: boolean = true;
    
    /** Default constructor
     * @class ModelReliefViewerControls
     * @constructor
     */
    constructor(modelReliefView : ModelReliefView) {  

        this._modelReliefView = modelReliefView;

        // UI Controls
        this.initializeControls();
    }

//#region Event Handlers
    /**
     * Generates a relief from the current model camera.
     */
    generateRelief() : void { 

        // pixels
        let width = 512;
        let height = width / this._modelReliefView.modelViewer.aspectRatio;
        let factory = new DepthBufferFactory({ width: width, height: height, model: this._modelReliefView.modelViewer.model, camera: this._modelReliefView.modelViewer.camera, addCanvasToDOM: false });

        let previewMesh: THREE.Mesh = factory.meshGenerate({});

        this._modelReliefView._meshViewer.setModel(previewMesh);
        if (this._initialMeshGeneration) {
            this._modelReliefView._meshViewer.fitView();
            this._initialMeshGeneration = false;
        }
       
        // Services.consoleLogger.addInfoMessage('Relief generated');
    }

    /**
     * Saves the relief to a disk file.
     */
    saveRelief(): void {

        let exportTag = Services.timer.mark('Export OBJ');
        let exporter = new OBJExporter();
        let result = exporter.parse(this._modelReliefView.meshViewer.model);

        let request = new XMLHttpRequest();

        let viewerUrl = window.location.href;
        let postUrl = viewerUrl.replace('Viewer', 'Save');
        request.open("POST", postUrl, true);
        request.onload = function (oEvent) {
            // uploaded...
        };

        let blob = new Blob([result], { type: 'text/plain' });
        request.send(blob)

        Services.timer.logElapsedTime(exportTag);
    }
    //#endregion

    /**
     * Initialize the view settings that are controllable by the user
     */
    initializeControls() {

        let scope = this;

        this._modelReliefViewSettings = new ModelReliefViewSettings(this.generateRelief.bind(this), this.saveRelief.bind(this));

        // Init dat.gui and controls for the UI
        let gui = new dat.GUI({
            autoPlace: false,
            width: 320
        });
        let menuDiv = document.getElementById(this._modelReliefView.containerId);
        menuDiv.appendChild(gui.domElement);

        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        //                                                                   ModelRelief                                                                //      
        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        let modelReliefViewOptions = gui.addFolder('ModelRelief Options');

        // Generate Relief
        let controlGenerateRelief = modelReliefViewOptions.add(this._modelReliefViewSettings, 'generateRelief').name('Generate Relief');

        // Save Relief
        let controlSaveRelief = modelReliefViewOptions.add(this._modelReliefViewSettings, 'saveRelief').name('Save Relief');

        modelReliefViewOptions.open();
    }    
}
