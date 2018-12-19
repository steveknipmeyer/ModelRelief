// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {NormalMap} from "Scripts/Models/NormalMap/NormalMap";
import {ImageViewer} from "Scripts/Viewers/ImageViewer";
import {NormalMapViewerControls} from "Scripts/Viewers/NormalMapViewerControls";

/**
 * @description Graphics viewer for a NormalMap.
 * @export
 * @class NormalMapViewer
 */
export class NormalMapViewer extends ImageViewer {

    // Private
    private _normalMapViewerControls: NormalMapViewerControls;            // UI controls

    /**
     * Creates an instance of NormalMapViewer.
     * @param {string} name Viewer name.
     * @param {string} canvasId HTML element to host the viewer.
     * @param {NormalMap} normalMap The NormalMap bound to this viewer.
     */
    constructor(name: string, canvasId: string, normalMap: NormalMap) {

        super(name, canvasId, normalMap);
    }

//#region Properties
//#endregion

//#region Event Handlers
//#endregion

//#region Initialization
    /**
     * @description UI controls initialization.
     */
    public initializeUIControls() {

        this._normalMapViewerControls = new NormalMapViewerControls(this);
    }
//#endregion
}
