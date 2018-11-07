
// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {IModel} from "Scripts/Api/V1/Interfaces/IModel";

/**
 *  Common interface for all file-backed DTOs (e.g. DepthBuffer, Mesh, Model3d).
 *  Not exposed in UX; API only.
 *  @interface
 */
export interface IFileModel extends IModel {

    fileTimeStamp?: Date;
}
