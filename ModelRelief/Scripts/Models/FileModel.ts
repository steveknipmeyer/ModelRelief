// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

"use strict";

import { assert }                   from 'chai'
import { IFileModel }               from 'IFileModel'
import { Model }                    from 'Model'
import { ILogger, ConsoleLogger }   from 'Logger'
import { Services }                 from 'Services'

/**
 * @description Common base class for all application models based on DTO IFileModel models.
 * @export
 * @class FileModel
 * @implements {IFileModel}
 * @template T 
 */
export class FileModel<T extends IFileModel> extends Model<T> implements IFileModel {

    fileTimeStamp?: Date;                   //  time stamp of file 

    /**
     * Creates an instance of FileModel.
     * @param {IModel} parameters 
     */
    constructor(parameters: IFileModel) {

        super (parameters);

        this.fileTimeStamp = parameters.fileTimeStamp || undefined;
    }
}
