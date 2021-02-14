// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import * as dat from "dat.gui";
import {SettingsManager} from "Scripts/System/SettingsManager";
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
    constructor(normalMapViewer: unknown) {

        this._normalMapViewer = normalMapViewer;

        // UI Controls
        if (SettingsManager.userSettings.normalMapViewVisible)
            this.initializeControls();
    }

//#region Event Handlers
//#endregion

    /**
     * Initialize the view settings that are controllable by the user
     */
    public initializeControls(): void {


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

            this._normalMapViewer.displayImage(value);
        });
        normalMapViewerOptions.open();
    }
}
