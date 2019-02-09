// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE from "three";

import {NormalMap} from "Scripts/Models/NormalMap/NormalMap";
import {Format} from "Scripts/System/Format";
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

//#region Analysis
    /**
     * @description Analyze a pixel.
     * @param row Image row.
     * @param column Image column.
     */
    public analyzePixel(row: number, column: number) {

        const normalMap = this.imageModel as NormalMap;
        const normalVector: THREE.Vector3 = normalMap.normal(row, column);

        Format.numericPrecision      = 2;
        Format.numericFieldWidth     = 4;
        Format.vectorLabelFieldWidth = -1;
        const messageStyle = "color:fuchsia";
        this._logger.addMessage(`${Format.formatVector3("Normal", normalVector)}`, messageStyle);
        this._logger.addEmptyLine();
    }
//#endregion
}
