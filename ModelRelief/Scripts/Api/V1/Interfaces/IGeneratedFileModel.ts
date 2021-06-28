
// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";

import {IFileModel} from "Scripts/Api/V1/Interfaces/IFileModel";

/**
 *  Common interface for all generated file DTOs (e.g. DepthBuffer, Mesh).
 *  Not exposed in UX; API only.
 *  @interface
 */
export interface IGeneratedFileModel extends IFileModel {

    fileIsSynchronized?: boolean;           // associated file is synchronized with the model (AND all of the the model's dependencies)
}
