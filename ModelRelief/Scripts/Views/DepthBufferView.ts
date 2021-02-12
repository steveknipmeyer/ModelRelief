// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {DepthBuffer} from "Scripts/Models/DepthBuffer/DepthBuffer";
import {ElementIds} from "Scripts/System/Html";
import {SystemSettings} from "Scripts/System/SystemSettings";
import {DepthBufferViewer} from "Scripts/Viewers/DepthBufferViewer";

/**
 * @description Represents a UI view of a DepthBuffer.
 * @export
 * @class DepthBufferView
 */
export class DepthBufferView {

    public _containerId: string;
    public _depthBufferViewer: DepthBufferViewer;

    /**
     * Creates an instance of DepthBufferView.
     * @param {string} containerId DOM container Id of view.
     * @param {DepthBuffer} depthBuffer The DepthBuffer bound to this view.
     */
    constructor(containerId: string, depthBuffer: DepthBuffer) {

        this._containerId = containerId;

        this.initialize(depthBuffer);
    }

    //#region Properties
    /**
     * @description Gets the Container Id.
     * @readonly
     * @type {string}
     */
    get containerId(): string {

        return this._containerId;
    }

    /**
     * @description Gets the DepthBufferViewer.
     * @readonly
     * @type {DepthBufferViewer}
     */
    get depthBufferViewer(): DepthBufferViewer {

        return this._depthBufferViewer;
    }
    //#endregion

    //#region Event Handlers
    //#endregion

    //#region Initialization
    /**
     * @description Performs initialization.
     * @param {DepthBuffer} depthBuffer The DepthBuffer bound to this view.
     */
    public initialize(depthBuffer: DepthBuffer): void {

        // DepthBuffer Viewer
        this._depthBufferViewer = new DepthBufferViewer("DepthBufferViewer", ElementIds.DepthBufferCanvas, depthBuffer);

        if (!SystemSettings.depthBufferViewVisible) {
            const depthBufferViewerElement = document.getElementById(ElementIds.DepthBufferCanvas);
            depthBufferViewerElement.style.display = "none";
        }
    }

//#endregion
}
