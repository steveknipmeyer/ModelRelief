﻿// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {NormalMap} from "Scripts/Models/NormalMap/NormalMap";
import {ElementIds} from "Scripts/System/Html";
import {NormalMapViewer} from "Scripts/Viewers/NormalMapViewer";

/**
 * @description Represents a UI view of a NormalMap.
 * @export
 * @class NormalMapView
 */
export class NormalMapView {

    public _containerId: string;
    public _normalMapViewer: NormalMapViewer;

    /**
     * Creates an instance of NormalMapView.
     * @param {string} containerId DOM container Id of view.
     * @param {NormalMap} normalMAp The NormalMap bound to this view.
     */
    constructor(containerId: string, normalMAp: NormalMap) {

        this._containerId = containerId;

        this.initialize(normalMAp);
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
     * @description Gets the NormalMapViewer.
     * @readonly
     * @type {NormalMapViewer}
     */
    get normalMapViewer(): NormalMapViewer {

        return this._normalMapViewer;
    }
//#endregion

//#region Event Handlers
//#endregion

//#region Initialization
    /**
     * @description Performs initialization.
     * @param {NormalMap} normalMap The NormalMap bound to this view.
     */
    public initialize(normalMap: NormalMap) {

        // NormalMap Viewer
        this._normalMapViewer = new NormalMapViewer("NormalMapViewer", ElementIds.NormalMapCanvas, normalMap);
    }

//#endregion
}