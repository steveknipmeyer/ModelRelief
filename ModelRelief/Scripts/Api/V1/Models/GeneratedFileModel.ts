// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE       from 'three'

import {ContentType, HttpLibrary, 
    MethodType, ServerEndPoints}        from 'Http'
import { IGeneratedFileModel }          from 'IGeneratedFileModel'
import { FileModel }                    from 'FileModel'
import { Services }                     from 'Services'
import { RequestResponse }              from 'RequestResponse'

/**
 * @description Base class for a generated file-backed DTO model.
 * @export
 * @class GeneratedFileModel
 * @extends {FileModel<T>}
 * @implements {IGeneratedFileModel}
 * @template T 
 */
export class GeneratedFileModel<T extends IGeneratedFileModel> extends FileModel<T> implements IGeneratedFileModel{

    // not exposed in UX; API only
    fileIsSynchronized: boolean;

    /**
     * Creates an instance of GeneratedFileModel.
     * @param {IGeneratedFile} [parameters] Initialization parameters.
     */
    constructor(parameters: IGeneratedFileModel = {}) {

        super (parameters);

        this.fileIsSynchronized = parameters.fileIsSynchronized;
    }
}
