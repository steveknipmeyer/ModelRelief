// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'

import {DepthBufferFactory}         from "DepthBufferFactory"
import {ElementAttributes, ElementIds} from "Html"
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
    
    constructor() {
        
        this.displayGrid    = true; 
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
//#endregion

    /**
     * Initialize the view settings that are controllable by the user
     */
    initializeControls() {

        let scope = this;

        this._modelViewerSettings = new ModelViewerSettings();

        // Init dat.gui and controls for the UI
        let gui = new dat.GUI({
            autoPlace: false,
            width: ElementAttributes.DatGuiWidth,
        });
        gui.domElement.id = ElementIds.ModelViewerControls;

        let containerDiv = document.getElementById(this._modelViewer.containerId);
        containerDiv.appendChild(gui.domElement);

        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        //                                                                   ModelViewer                                                                //      
        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        let modelViewerOptions = gui.addFolder('ModelViewer Options');

        // Grid
        let controlDisplayGrid = modelViewerOptions.add(this._modelViewerSettings, 'displayGrid').name('Display Grid');
        controlDisplayGrid.onChange ((value : boolean) => {

            scope._modelViewer.displayGrid(value);
        });
        modelViewerOptions.open();
    }    
}
