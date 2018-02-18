// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { assert }                   from 'chai'
import { FileModel }                from 'FileModel'
import { IGeneratedFileModel }      from 'IGeneratedFileModel'
import { ILogger, ConsoleLogger }   from 'Logger'
import { Services }                 from 'Services'

/**
 * @description Common base class for all application models based on DTO IGeneratedFileModel models.
 * @export
 * @class GeneratedFileModel
 * @implements {IGeneratedFileModel}
 * @template T 
 */
export class GeneratedFileModel<T extends IGeneratedFileModel> extends FileModel<T> implements IGeneratedFileModel {

    fileIsSynchronized?: boolean;           // associated file is synchronized with the model (AND all of the the model's dependencies)

    /**
     * Creates an instance of GeneratedFileModel.
     * @param {IGeneratedFile} parameters 
     */
    constructor(parameters: IGeneratedFileModel) {

        super (parameters);

        this.fileIsSynchronized = parameters.fileIsSynchronized || undefined;
    }
}
