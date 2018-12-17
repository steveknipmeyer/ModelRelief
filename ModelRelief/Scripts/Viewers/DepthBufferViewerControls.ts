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
 * DepthBufferViewer Settings
 */
class DepthBufferViewerSettings {

    public displayDepthBuffer: boolean;

    constructor() {

        this.displayDepthBuffer = true;
    }
}

/**
 * DepthBufferViewer UI Controls.
 */
export class DepthBufferViewerControls {

    public _depthBufferViewer: any;                                             // associated viewer
    public _depthBufferViewerSettings: DepthBufferViewerSettings;               // UI settings

    /**
     * Creates an instance of DepthBufferViewerControls.
     * @param {*} depthBufferViewer
     */
    constructor(depthBufferViewer: any) {

        this._depthBufferViewer = depthBufferViewer;

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

        this._depthBufferViewerSettings = new DepthBufferViewerSettings();

        // Init dat.gui and controls for the UI
        const gui = new dat.GUI({
            autoPlace: false,
            width: ElementAttributes.DatGuiWidth,
        });
        gui.domElement.id = ElementIds.DepthBufferViewerControls;

        const containerDiv = document.getElementById(this._depthBufferViewer.containerId);
        containerDiv.appendChild(gui.domElement);

        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        //                                                                   DepthBufferViewer                                                          //
        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        const depthBufferViewerOptions = gui.addFolder("DepthBufferViewer Options");

        // DepthBuffer
        const controlDisplayDepthBuffer = depthBufferViewerOptions.add(this._depthBufferViewerSettings, "displayDepthBuffer").name("Display DepthBuffer");
        controlDisplayDepthBuffer.onChange ((value: boolean) => {

            scope._depthBufferViewer.displayDepthBuffer(value);
        });
        depthBufferViewerOptions.open();
    }
}
