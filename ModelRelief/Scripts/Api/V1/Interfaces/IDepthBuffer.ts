// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { ICamera } from "./ICamera";
import { IGeneratedFileModel } from "./IGeneratedFileModel";
import { IModel3d } from "./IModel3d";
import { IProject } from "./IProject";

 /**
  *  Depth buffer file formats.
  *  @enum {number}
  */
export enum DepthBufferFormat {
    None,       // unknown
    SDB,        // single precision depth buffer
    DDB,        // double precision depth buffer
    SFP,        // single precision float (model units)
    DFP,        // double precision float (model units)
    PNG,        // PNG format
    JPG,        // JPG format
}

 /**
  *  Represents a DTO for a DepthBuffer.
  *  N.B. All properties in the interface are optional so that an initialization object can be used to construct the concrete class.
  *  @interface
  */
export interface IDepthBuffer extends IGeneratedFileModel {

    id?: number;
    name?: string;
    description?: string;

    width?: number;
    height?: number;
    format?: DepthBufferFormat;

    // Navigation Properties
    projectId?: number;
    project?: IProject;

    model3dId?: number;
    model3d?: IModel3d;

    cameraId?: number;
    camera?: ICamera;

    // not exposed in UX; API only
    fileTimeStamp?: Date;
    fileIsSynchronized?: boolean;
}


