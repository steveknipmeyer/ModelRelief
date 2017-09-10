// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'

import { ComposerView } from "ComposerView"
import {DepthBufferFactory}         from "DepthBufferFactory"
import {Logger, ConsoleLogger}      from 'Logger'
import {Graphics}                   from "Graphics"
import {ModelViewer}                from "ModelViewer"
import {OBJExporter}                from "OBJExporter"
import {Services}                   from 'Services'

/**
 * @class
 * ComposerViewSettings
 */
class ComposerViewSettings {

    generateRelief : () => void;
    saveRelief     : () => void;

    constructor(generateRelief: () => any, saveRelief: () => any) {
        
        this.generateRelief = generateRelief;
        this.saveRelief     = saveRelief;
    }
}

/**
 * ComposerView UI Controls.
 */    
export class ComposerViewControls {

    _composerView         : ComposerView;                       // application view
    _composerViewSettings : ComposerViewSettings;               // UI settings

    _initialMeshGeneration: boolean = true;
    
    /** Default constructor
     * @class ComposerViewControls
     * @constructor
     */
    constructor(composerView : ComposerView) {  

        this._composerView = composerView;

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
        let height = width / this._composerView.modelView.modelViewer.aspectRatio;
        let factory = new DepthBufferFactory({ width: width, height: height, model: this._composerView.modelView.modelViewer.model, camera: this._composerView.modelView.modelViewer.camera, addCanvasToDOM: false });

        let previewMesh: THREE.Mesh = factory.meshGenerate({});

        this._composerView._meshView.meshViewer.setModel(previewMesh);
        if (this._initialMeshGeneration) {
            this._composerView._meshView.meshViewer.fitView();
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
        let result = exporter.parse(this._composerView.meshView.meshViewer.model);

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

        this._composerViewSettings = new ComposerViewSettings(this.generateRelief.bind(this), this.saveRelief.bind(this));

        // Init dat.gui and controls for the UI
        let gui = new dat.GUI({
            autoPlace: false,
            width: 320
        });
        let menuDiv = document.getElementById(this._composerView.containerId);
        menuDiv.appendChild(gui.domElement);

        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        //                                                                   ModelRelief                                                                //      
        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        let composerViewOptions = gui.addFolder('Composer Options');

        // Generate Relief
        let controlGenerateRelief = composerViewOptions.add(this._composerViewSettings, 'generateRelief').name('Generate Relief');

        // Save Relief
        let controlSaveRelief = composerViewOptions.add(this._composerViewSettings, 'saveRelief').name('Save Relief');

        composerViewOptions.open();
    }    
}
