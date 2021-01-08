// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import * as dat from "dat.gui";
import {ElementAttributes, ElementIds} from "Scripts/System/Html";
import {SystemSettings} from "Scripts/System/SystemSettings";
import {MeshViewer} from "Scripts/Viewers/MeshViewer";

/**
 * @class
 * MeshViewer Settings
 */
class MeshViewerSettings {

    constructor() {
        // NOP
    }
}

/**
 * MeshViewer UI Controls.
 */
export class MeshViewerControls {

    private _meshViewer: MeshViewer;                                // associated viewer
    private _meshViewerSettings: MeshViewerSettings;                // UI settings

    /**
     * Creates an instance of MeshViewerControls.
     * @param {MeshViewer} meshViewer
     */
    constructor(meshViewer: MeshViewer) {

        this._meshViewer = meshViewer;

        // UI Controls
        if (SystemSettings.developmentUI)
            this.initializeControls();
    }

//#region Event Handlers
//#endregion

    /**
     * Initialize the view settings that are controllable by the user
     */
    public initializeControls(): void {

        this._meshViewerSettings = new MeshViewerSettings();

        // Init dat.gui and controls for the UI
        const gui = new dat.GUI({
            autoPlace: false,
            width: ElementAttributes.DatGuiWidth,
        });
        gui.domElement.id = ElementIds.MeshViewerControls;

        const containerDiv = document.getElementById(this._meshViewer.containerId);
        containerDiv.appendChild(gui.domElement);

        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        //                                                                   MeshViewer                                                                 //
        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        const meshViewerOptions = gui.addFolder("MeshViewer Options");

        meshViewerOptions.open();
    }
}
