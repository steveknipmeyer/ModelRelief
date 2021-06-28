// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";
import {DtoFileModel} from "Scripts/Api/V1/Base/DtoFileModel";
import {IGeneratedFileModel} from "Scripts/Api/V1/Interfaces/IGeneratedFileModel";

/**
 * @description Base class for a generated file-backed DTO model.
 * @export
 * @class GeneratedFileModel
 * @extends {DtoFileModel<T>}
 * @implements {IGeneratedFileModel}
 * @template T
 */
export class DtoGeneratedFileModel<T extends IGeneratedFileModel> extends DtoFileModel<T> implements IGeneratedFileModel {

    // not exposed in UX; API only
    public fileIsSynchronized: boolean;

    /**
     * Creates an instance of GeneratedFileModel.
     * @param {IGeneratedFile} [parameters] Initialization parameters.
     */
    constructor(parameters: IGeneratedFileModel = {}) {

        super(parameters);

        this.fileIsSynchronized = parameters.fileIsSynchronized;
    }
}
