// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";
import * as Dto from "Scripts/Api/V1/Models/DtoModels";

import {IFileModel} from "Scripts/Api/V1/Interfaces/IFileModel";
import {Model} from "Scripts/Models/Base/Model";

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
    private fileArray: Uint8Array;
    private fileString: string;

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
}
