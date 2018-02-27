// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE       from 'three'

import { ContentType, HttpLibrary, 
         MethodType, ServerEndPoints }  from 'Http'
import { IGeneratedFileModel }          from 'IGeneratedFileModel'
import { FileModel }                    from 'FileModel'
import { RequestResponse }              from 'RequestResponse'
import { Services }                     from 'Services'

/**
 * @description Base class for a generated file-backed DTO model.
 * @export
 * @class GeneratedFileModel
 * @extends {FileModel}
 * @implements {IGeneratedFileModel}
 */
export class GeneratedFileModel extends FileModel implements IGeneratedFileModel{

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
