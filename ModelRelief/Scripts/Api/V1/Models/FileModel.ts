// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE       from 'three'

import { Exception }                        from 'Exception';
import {ContentType, HttpLibrary, 
        MethodType, ServerEndPoints}        from 'Http'
import { IFileModel }                       from 'IFileModel'
import { Model }                            from 'Model'
import { Services }                         from 'Services'
import { RequestResponse }                  from 'RequestResponse'

/**
 * @description Base class for a file-backed DTO model.
 * @export 
 * @class FileModel
 * @extends {Model<T>}
 * @implements {IFileModel}
 * @template T 
 */
export class FileModel<T extends IFileModel> extends Model<T> implements IFileModel{

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
}
