// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                   from 'three'
import * as Dto                     from 'DtoModels' ;

import { Exception }                        from 'Exception';
import {ContentType, HttpLibrary, 
        MethodType, ServerEndPoints}        from 'Http'
import { IFileModel }                       from 'IFileModel'
import { Model }                            from 'Model'
import { Services }                         from 'Services'
import { RequestResponse }                  from 'RequestResponse'

/**
 * @description Base class for a file-backed FE models.
 * @export
 * @class FileModel
 * @extends {Model}
 * @implements {IFileModel}
 */
export class FileModel extends Model implements IFileModel{

    // not exposed in UX; API only
    fileTimeStamp: Date;

    // Private
    fileArray  : Uint8Array;
    fileString : string;

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
    toDtoModel() : Dto.FileModel<any> {
        return undefined;
    }

    /**
     * @description Returns a graphics represention of the model.
     * @returns {Promise<THREE.Group>} 
     */
    getModelGroupAsync?() : Promise<THREE.Group> {
        return undefined;
    }
}
