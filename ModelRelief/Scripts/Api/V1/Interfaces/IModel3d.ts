// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { ICamera } from "./ICamera";
import { IFileModel } from "./IFileModel";
import { IProject } from "./IProject";

 /**
  *  3D model file formats.
  *  @enum {number}
  */
export enum Model3dFormat {
    None,           // unknown
    OBJ,            // Wavefront OBJ
    STL,            // Stereolithography
}

 /**
  *  Represents a DTO for a Model3d.
  *  N.B. All properties in the interface are optional so that an initialization object can be used to construct the concrete class.
  *  @interface
  */
export interface IModel3d extends IFileModel {

    id?: number;
    name?: string;
    description?: string;

    format?: Model3dFormat;

    // Navigation Properties
    projectId?: number;
    project?: IProject;

    cameraId?: number;
    camera?: ICamera;

    // not exposed in UX; API only
    fileTimeStamp?: Date;
}


