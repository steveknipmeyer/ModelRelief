// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {Graphics} from "Scripts/Graphics/Graphics";
import {DepthBuffer} from "Scripts/Models/DepthBuffer/DepthBuffer";
import {ILogger} from "Scripts/System/Logger";
import {Services} from "Scripts/System/Services";
import {DepthBufferViewerControls} from "Scripts/Viewers/DepthBufferViewerControls";
import {ImageViewer} from "Scripts/Viewers/ImageViewer";

/**
 * @description Graphics viewer for a DepthBuffer.
 * @export
 * @class DepthBufferViewer
 */
export class DepthBufferViewer extends ImageViewer {

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

        this._imageViewerControls = new DepthBufferViewerControls(this);
    }
//#endregion
}
