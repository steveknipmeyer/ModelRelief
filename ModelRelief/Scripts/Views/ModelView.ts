// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three';
import * as dat    from 'dat-gui';
import * as Dto    from "DtoModels";

import { ElementIds }            from "Html";
import { FileModel }             from 'FileModel';
import { ModelViewer }           from "ModelViewer";

/**
 * @description Represents a UI view of a 3D model.
 * @export
 * @class ModelView
 */
export class ModelView {

    _containerId                : string;
    _modelViewer                : ModelViewer;

    /**
     * Creates an instance of ModelView.
     * @param {string} containerId DOM container Id of view.
     * @param {FileModel} model Initial model to load.
     */
    constructor(containerId : string, model : FileModel) {

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
    initialize(model : FileModel) {

        // Model Viewer
        this._modelViewer = new ModelViewer('ModelViewer', ElementIds.ModelCanvas, model);
    }

//#endregion
}

