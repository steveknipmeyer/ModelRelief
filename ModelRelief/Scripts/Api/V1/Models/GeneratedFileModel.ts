// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {IGeneratedFileModel} from "Scripts/Api/V1/Interfaces/IGeneratedFileModel";
import {FileModel} from "Scripts/Api/V1/Models/FileModel";

/**
 * @description Base class for a generated file-backed DTO model.
 * @export
 * @class GeneratedFileModel
 * @extends {FileModel}
 * @implements {IGeneratedFileModel}
 */
export class GeneratedFileModel extends FileModel implements IGeneratedFileModel {

    // not exposed in UX; API only
    public fileIsSynchronized: boolean;

    /**
     * Creates an instance of GeneratedFileModel.
     * @param {IGeneratedFile} [parameters] Initialization parameters.
     */
    constructor(parameters: IGeneratedFileModel = {}) {

        super (parameters);

        this.fileIsSynchronized = parameters.fileIsSynchronized;
    }
}
