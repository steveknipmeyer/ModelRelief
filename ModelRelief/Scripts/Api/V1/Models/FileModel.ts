// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE from "three";
import * as Dto from "./DtoModels" ;

import { IFileModel } from "../Interfaces/IFileModel";
import { Model } from "./Model";

/**
 * @description Base class for a file-backed FE models.
 * @export
 * @class FileModel
 * @extends {Model}
 * @implements {IFileModel}
 */
export class FileModel extends Model implements IFileModel {

    // not exposed in UX; API only
    public fileTimeStamp: Date;

    // Private
    public fileArray: Uint8Array;
    public fileString: string;

    /**
     * Creates an instance of FileModel.
     * @param {IModel} [parameters] Initialization parameters.
     */
    constructor(parameters: IFileModel = {}) {

        super (parameters);

        this.fileTimeStamp = parameters.fileTimeStamp || undefined;
    }

    /**
     * @description Returns a DTO model from the instance.
     * WIP: Can the return value be strongly typed?
     * @returns {Dto.FileModel}
     */
    public toDtoModel(): Dto.FileModel<any> {
        return undefined;
    }

    /**
     * @description Returns a graphics represention of the model.
     * @returns {Promise<THREE.Group>}
     */
    public getModelGroupAsync?(): Promise<THREE.Group> {
        return undefined;
    }
}
