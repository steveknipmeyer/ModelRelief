
// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {ICamera} from "Scripts/Api/V1/Interfaces/ICamera";
import {IDepthBuffer} from "Scripts/Api/V1/Interfaces/IDepthBuffer";
import {IGeneratedFileModel} from "Scripts/Api/V1/Interfaces/IGeneratedFileModel";
import {IMeshTransform} from "Scripts/Api/V1/Interfaces/IMeshTransform";
import {INormalMap} from "Scripts/Api/V1/Interfaces/INormalMap";
import {IProject} from "Scripts/Api/V1/Interfaces/IProject";

 /**
  *  Mesh file formats.
  *  @enum {number}
  */
export enum MeshFormat {
    None,           // unknown
    SDB,        // single precision depth buffer
    DDB,        // double precision depth buffer
    SFP,        // single precision float (model units)
    DFP,        // double precision float (model units)
    OBJ,        // Wavefront OBJ
    STL,        // Stereolithography
}

 /**
  *  Represents a DTO for a Mesh.
  *  N.B. All properties in the interface are optional so that an initialization object can be used to construct the concrete class.
  *  @interface
  */
export interface IMesh extends IGeneratedFileModel {

    id?: number;
    name?: string;
    description?: string;

    format?: MeshFormat;

    // Navigation Properties
    projectId?: number;
    project?: IProject;

    cameraId?: number;
    camera?: ICamera;

    depthBufferId?: number;
    depthBuffer?: IDepthBuffer;

    normalMapId?: number;
    normalMap?: INormalMap;

    meshTransformId?: number;
    meshTransform?: IMeshTransform;

    // not exposed in UX; API only
    fileTimeStamp?: Date;
    fileIsSynchronized?: boolean;
}


