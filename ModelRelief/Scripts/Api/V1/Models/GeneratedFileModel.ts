﻿// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { FileModel } from "FileModel";
import { IGeneratedFileModel } from "IGeneratedFileModel";

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
