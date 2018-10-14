// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as dat from 'dat-gui'

import {ElementAttributes, ElementIds}  from "Html"

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

    _meshViewer          : any;                             // associated viewer
    _meshViewerSettings  : MeshViewerSettings;              // UI settings

    /**
     *Creates an instance of MeshViewerControls.
     * @param {MeshViewer} meshViewer
     */
    constructor(meshViewer : any) {

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
