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
import {ModelViewer}                from "ModelViewer"
import {Services}                   from 'Services'

/**
 * @class
 * ModelViewer Settings
 */
class ModelViewerSettings {

    displayGrid    : boolean;
    generateRelief : () => void;
    
    constructor(generateRelief : () => any) {
        
        this.displayGrid    = true; 
        this.generateRelief = generateRelief;
    }
}

/**
 * ModelViewer UI Controls.
 */    
export class ModelViewerControls {

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

//#region Event Handlers
    /**
     * Generates a relief from the current model camera.
     */
    generateRelief() : void { 

        this._modelViewer.generateRelief();
    }
//#endregion

    /**
     * Initialize the view settings that are controllable by the user
     */
    initializeControls() {

        let scope = this;

        this._modelViewerSettings = new ModelViewerSettings(this.generateRelief.bind(this));

        // Init dat.gui and controls for the UI
        let gui = new dat.GUI({
            autoPlace: false,
            width: 320
        });
        let menuDiv = document.getElementById(this._modelViewer.containerId);
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
    }    
}
