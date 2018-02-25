// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {IModel} from "IModel"

/**
 *  Common interface for all file-backed DTOs (e.g. DepthBuffer, Mesh, Model3d).
 *  Not exposed in UX; API only.
 *  @interface
 */
export interface IFileModel extends IModel {

    fileTimeStamp?: Date;                   //  time stamp of file 
    
    mesh?() : THREE.Mesh;
    getFileAsync?() : Promise<Uint8Array>;
    getFileAsStringAsync?() : Promise<string>;
}
