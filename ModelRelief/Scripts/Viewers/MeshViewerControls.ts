// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'

import {ElementAttributes, ElementIds}  from "Html"
import {Logger, ConsoleLogger}          from 'Logger'
import {Graphics}                       from "Graphics"
import {MeshViewer}                     from "MeshViewer"
import {Services}                       from 'Services'

/**
 * @class
 * MeshViewer Settings
 */
class MeshViewerSettings {
   
    constructor() {

    }
}

/**
 * MeshViewer UI Controls.
 */    
export class MeshViewerControls {

    _meshViewer          : MeshViewer;                     // associated viewer
    _meshViewerSettings  : MeshViewerSettings;             // UI settings

    /** Default constructor
     * @class MeshViewerControls
     * @constructor
     */
    constructor(meshViewer : MeshViewer) {  

        this._meshViewer = meshViewer;

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

        this._meshViewerSettings = new MeshViewerSettings();

        // Init dat.gui and controls for the UI
        let gui = new dat.GUI({
            autoPlace: false,
            width: ElementAttributes.DatGuiWidth
        });
        gui.domElement.id = ElementIds.MeshViewerControls;
        
        let containerDiv = document.getElementById(this._meshViewer.containerId);
        containerDiv.appendChild(gui.domElement);

        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        //                                                                   MeshViewer                                                                 //      
        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        let meshViewerOptions = gui.addFolder('MeshViewer Options');

        meshViewerOptions.open();
    }    
}
