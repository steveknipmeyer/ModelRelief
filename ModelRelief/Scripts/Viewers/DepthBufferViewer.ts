// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {DepthBuffer} from "Scripts/Models/DepthBuffer/DepthBuffer";
import {DepthBufferViewerControls} from "Scripts/Viewers/DepthBufferViewerControls";
import {ImageViewer} from "Scripts/Viewers/ImageViewer";

/**
 * @description Graphics viewer for a DepthBuffer.
 * @export
 * @class DepthBufferViewer
 */
export class DepthBufferViewer extends ImageViewer {

    // Private
    _depthBufferViewerControls : DepthBufferViewerControls;

    /**
     * Creates an instance of DepthBufferViewer.
     * @param {string} name Viewer name.
     * @param {string} canvasId HTML element to host the viewer.
     * @param {DepthBuffer} depthBuffer The DepthBuffer bound to this viewer.
     */
    constructor(name: string, canvasId: string, depthBuffer: DepthBuffer) {

        super(name, canvasId, depthBuffer);
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

        this._depthBufferViewerControls = new DepthBufferViewerControls(this);
    }
//#endregion
}
