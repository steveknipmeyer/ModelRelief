﻿// ------------------------------------------------------------------------//
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
        if (SystemSettings.meshViewerExtendedControls)
            this.initializeControls();
    }

//#region Event Handlers
//#endregion

    /**
     * Initialize the view settings that are controllable by the user
     */
    public initializeControls(): void {

        this._meshViewerSettings = new MeshViewerSettings();

        // early exit if no controls
        if (Object.keys(this._meshViewerSettings).length === 0)
            return;

        // Init dat.gui and controls for the UI
        const gui = new dat.GUI({
            autoPlace: false,
            width: ElementAttributes.DatGuiWidth,
        });
        gui.domElement.id = ElementIds.MeshViewerControls;

        // insert controls <after> Viewer container; class 'container-fluid' impacts layout
        const viewContainerDiv = document.getElementById(this._meshViewer.viewContainerId);
        viewContainerDiv.parentNode.insertBefore(gui.domElement, viewContainerDiv.nextSibling);

        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        //                                                                   MeshViewer                                                                 //
        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        const meshViewerOptions = gui.addFolder("MeshViewer Options");

        meshViewerOptions.open();
    }
}
