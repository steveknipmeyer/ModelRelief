// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {IModel} from "IModel"

/**
 *  Common interface for all generated file DTOs (e.g. Mesh, DepthBuffer).
 *  Not exposed in UX; API only.
 *  @interface
 */
export interface IFileModel extends IModel {

    fileTimeStamp?: Date;                   //  time stamp of file 
}
