
// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {FileModel} from "Scripts/Models/Base/FileModel";
import {ElementIds} from "Scripts/System/Html";
import {SettingsManager} from "Scripts/System/SettingsManager";
import {CameraControls, ICameraControlsOptions} from "Scripts/Viewers/CameraControls";
import {ModelViewer} from "Scripts/Viewers/ModelViewer";
import {ModelViewerControls} from "Scripts/Viewers/ModelViewerControls";

/**
 * @description Represents a UI view of a 3D model.
 * @export
 * @class ModelView
 */
export class ModelView {

    private _containerId: string;
    private _modelViewer: ModelViewer;
    private _cameraControls: CameraControls;
    private _modelViewerControls: ModelViewerControls;

    /**
     * Creates an instance of ModelView.
     * @param {string} containerId DOM container Id of view.
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
     * @type {ModelViewer}
     */
    get modelViewer(): ModelViewer {

        return this._modelViewer;
    }
    //#endregion

    //#region Event Handlers
    //#endregion

    //#region Initialization
    /**
     * @description Performs initialization.
     * @param {FileModel} model Initial model to load.
     */
    public initialize(model: FileModel): void {

        // Model Viewer
        this._modelViewer = new ModelViewer("ModelViewer", ElementIds.ModelView, ElementIds.ModelCanvas, model);

        // Camera Controls
        const cameraControlsOptions: ICameraControlsOptions = {
            cameraHelper: SettingsManager.userSettings.developmentUI ? true : false,
        };
        this._cameraControls = new CameraControls(this._modelViewer, cameraControlsOptions);

        // Model Viewer Controls
        this._modelViewerControls = new ModelViewerControls(this._modelViewer);
    }

//#endregion
}

