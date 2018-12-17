// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as dat from "dat-gui";
import {ElementAttributes, ElementIds} from "Scripts/System/Html";

/**
 * @class
 * NormalMapViewer Settings
 */
class NormalMapViewerSettings {

    public displayNormalMap: boolean;

    constructor() {

        this.displayNormalMap = true;
    }
}

/**
 * NormalMapViewer UI Controls.
 */
export class NormalMapViewerControls {

    public _normalMapViewer: any;                                               // associated viewer
    public _normalMapViewerSettings: NormalMapViewerSettings;                   // UI settings

    /**
     * Creates an instance of NormalMapViewerControls.
     * @param {*} normalMapViewer
     */
    constructor(normalMapViewer: any) {

        this._normalMapViewer = normalMapViewer;

        // UI Controls
        this.initializeControls();
    }

//#region Event Handlers
//#endregion

    /**
     * Initialize the view settings that are controllable by the user
     */
    public initializeControls() {

        const scope = this;

        this._normalMapViewerSettings = new NormalMapViewerSettings();

        // Init dat.gui and controls for the UI
        const gui = new dat.GUI({
            autoPlace: false,
            width: ElementAttributes.DatGuiWidth,
        });
        gui.domElement.id = ElementIds.NormalMapViewerControls;

        const containerDiv = document.getElementById(this._normalMapViewer.containerId);
        containerDiv.appendChild(gui.domElement);

        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        //                                                                   NormalMapViewer                                                          //
        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        const normalMapViewerOptions = gui.addFolder("NormalMapViewer Options");

        // NormalMap
        const controlDisplayNormalMap = normalMapViewerOptions.add(this._normalMapViewerSettings, "displayNormalMap").name("Display NormalMap");
        controlDisplayNormalMap.onChange ((value: boolean) => {

            scope._normalMapViewer.displayImage(value);
        });
        normalMapViewerOptions.open();
    }
}
