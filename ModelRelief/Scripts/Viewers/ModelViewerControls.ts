// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as dat    from 'dat-gui'

import {ElementAttributes, ElementIds}  from "Html"

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

    _modelViewer         : any;                             // associated viewer
    _modelViewerSettings : ModelViewerSettings;             // UI settings

    /**
     *Creates an instance of ModelViewerControls.
     * @param {ModelViewer} modelViewer
     */
    constructor(modelViewer : any) {

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
