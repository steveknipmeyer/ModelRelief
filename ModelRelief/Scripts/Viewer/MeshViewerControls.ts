// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'

import {Logger, ConsoleLogger}      from 'Logger'
import {Graphics}                   from "Graphics"
import {MeshViewer}                 from "MeshViewer"
import {Services}                   from 'Services'

/**
 * @class
 * MeshViewer Settings
 */
class MeshViewerSettings {

    saveRelief : () => void;
    
    constructor(saveRelief : () => any) {
        
        this.saveRelief = saveRelief;
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
    /**
     * Saves the relief to a disk file.
     */
    saveRelief() : void { 

        this._meshViewer.saveRelief();
    }
//#endregion

    /**
     * Initialize the view settings that are controllable by the user
     */
    initializeControls() {

        let scope = this;

        this._meshViewerSettings = new MeshViewerSettings(this.saveRelief.bind(this));

        // Init dat.gui and controls for the UI
        let gui = new dat.GUI({
            autoPlace: false,
            width: 320
        });
        let menuDiv = document.getElementById(this._meshViewer.containerId);
        menuDiv.appendChild(gui.domElement);

        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        //                                                                   MeshViewer                                                                 //      
        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        let meshViewerOptions = gui.addFolder('MeshViewer Options');

        // Save Relief
        let controlSaveRelief = meshViewerOptions.add(this._meshViewerSettings, 'saveRelief').name('Save Relief');

        meshViewerOptions.open();
    }    
}
