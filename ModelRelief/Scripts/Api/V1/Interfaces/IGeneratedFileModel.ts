// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {IFileModel }    from "IFileModel"
import {IModel}         from "IModel"

/**
 *  Common interface for all generated file DTOs (e.g. Mesh, DepthBuffer).
 *  Not exposed in UX; API only.
 *  @interface
 */
export interface IGeneratedFileModel extends IFileModel {

    fileIsSynchronized?: boolean;           // associated file is synchronized with the model (AND all of the the model's dependencies)
}
