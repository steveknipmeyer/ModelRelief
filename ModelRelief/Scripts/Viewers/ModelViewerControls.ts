// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as dat from "dat-gui";
import {ElementAttributes, ElementIds} from "Scripts/System/Html";
import {SystemSettings} from "Scripts/System/SystemSettings";
import {ModelViewer} from "Scripts/Viewers/ModelViewer";

/**
 * @class
 * ModelViewer Settings
 */
class ModelViewerSettings {

    public displayGrid: boolean;

    constructor() {

        this.displayGrid    = true;
    }
}

/**
 * ModelViewer UI Controls.
 */
export class ModelViewerControls {

    private _modelViewer: ModelViewer;                               // associated viewer
    private _modelViewerSettings: ModelViewerSettings;               // UI settings

    /**
     * Creates an instance of ModelViewerControls.
     * @param {ModelViewer} modelViewer
     */
    constructor(modelViewer: ModelViewer) {

        this._modelViewer = modelViewer;

        // UI Controls
        if (SystemSettings.developmentUI)
            this.initializeControls();
    }

//#region Event Handlers
//#endregion

    /**
     * Initialize the view settings that are controllable by the user
     */
    public initializeControls() {

        const scope = this;

        this._modelViewerSettings = new ModelViewerSettings();

        // Init dat.gui and controls for the UI
        const gui = new dat.GUI({
            autoPlace: false,
            width: ElementAttributes.DatGuiWidth,
        });
        gui.domElement.id = ElementIds.ModelViewerControls;

        const containerDiv = document.getElementById(this._modelViewer.containerId);
        containerDiv.appendChild(gui.domElement);

        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        //                                                                   ModelViewer                                                                //
        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        const modelViewerOptions = gui.addFolder("ModelViewer Options");

        // Grid
        const controlDisplayGrid = modelViewerOptions.add(this._modelViewerSettings, "displayGrid").name("Display Grid");
        controlDisplayGrid.onChange ((value: boolean) => {

            scope._modelViewer.displayGrid(value);
        });
        modelViewerOptions.open();
    }
}
