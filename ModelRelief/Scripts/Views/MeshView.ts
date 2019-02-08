
// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {FileModel} from "Scripts/Api/V1/Models/FileModel";
import {ElementIds} from "Scripts/System/Html";
import {CameraControls, ICameraControlsOptions} from "Scripts/Viewers/CameraControls";
import {MeshViewer} from "Scripts/Viewers/MeshViewer";
import {MeshViewerControls} from "Scripts/Viewers/MeshViewerControls";

/**
 * @description UI View of a Mesh.
 * @export
 * @class MeshView
 */
export class MeshView {

    private _containerId: string;
    private _meshViewer: MeshViewer;
    private _cameraControls: CameraControls;
    private _meshViewerControls: MeshViewerControls;

    /**
     * Creates an instance of MeshView.
     * @param {string} containerId
     * @param {FileModel} model Initial model to load.
     */
    constructor(containerId: string, model: FileModel) {

        this._containerId = containerId;
        this.initialize(model);
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
     * @description Gets the ModelViewer.
     * @readonly
     * @type {MeshViewer}
     */
    get meshViewer(): MeshViewer {

        return this._meshViewer;
    }
//#endregion

//#region Event Handlers
//#endregion

//#region Initialization
    /**
     * @description Performs initialization.
     * @param {FileModel} model Initial model to load.
     */
    public initialize(model: FileModel) {

        // Mesh Viewer
        this._meshViewer = new MeshViewer("MeshViewer", ElementIds.MeshCanvas, model);

        // Camera Controls
        const cameraControlsOptions: ICameraControlsOptions = {
            cameraHelper     : false,
            fieldOfView      : false,
            clippingControls : false,
        };
        this._cameraControls = new CameraControls(this._meshViewer, cameraControlsOptions);

        // MeshViewer Controls
        this._meshViewerControls = new MeshViewerControls(this._meshViewer);
    }

//#endregion
}

