// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {DepthBuffer} from "Scripts/Models/DepthBuffer/DepthBuffer";
import {Format} from "Scripts/System/Format";
import {DepthBufferViewerControls} from "Scripts/Viewers/DepthBufferViewerControls";
import {ImageViewer} from "Scripts/Viewers/ImageViewer";

/**
 * @description Graphics viewer for a DepthBuffer.
 * @export
 * @class DepthBufferViewer
 */
export class DepthBufferViewer extends ImageViewer {

    // Private
    private _depthBufferViewerControls: DepthBufferViewerControls;

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
    public initializeUIControls(): void {

        this._depthBufferViewerControls = new DepthBufferViewerControls(this);
    }
//#endregion
//#region Analysis
    /**
     * @description Analyze a pixel.
     * @param row Image row.
     * @param column Image column.
     */
    public analyzePixel(row: number, column: number): void {

        const depthBuffer = this.imageModel as DepthBuffer;

        const messageStyle = "color:fuchsia";
        const precision = 2;
        const fieldWidth = 4;
        this._logger.addMessage(`Normalized Depth = ${Format.formatNumber(depthBuffer.depthNormalized(row, column), precision, fieldWidth)}`, messageStyle);
        this._logger.addEmptyLine();
    }
//#endregion

}
