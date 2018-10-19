
// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {FileModel} from "Scripts/Api/V1/Models/FileModel";
import {ElementIds} from "Scripts/System/Html";
import {ModelViewer} from "Scripts/Viewers/ModelViewer";

/**
 * @description Represents a UI view of a 3D model.
 * @export
 * @class ModelView
 */
export class ModelView {

    public _containerId: string;
    public _modelViewer: ModelViewer;

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
    public initialize(model: FileModel) {

        // Model Viewer
        this._modelViewer = new ModelViewer("ModelViewer", ElementIds.ModelCanvas, model);
    }

//#endregion
}

