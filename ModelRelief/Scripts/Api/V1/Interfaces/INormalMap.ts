
// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {ICamera} from "Scripts/Api/V1/Interfaces/ICamera";
import {IGeneratedFileModel} from "Scripts/Api/V1/Interfaces/IGeneratedFileModel";
import {IModel3d} from "Scripts/Api/V1/Interfaces/IModel3d";
import {IProject} from "Scripts/Api/V1/Interfaces/IProject";

 /**
  *  Normal map file formats.
  *  @enum {number}
  */
export enum NormalMapFormat {
    None,       // unknown
    NMAP,       // 8-bit normal map (XYZ)
    PNG,        // PNG format
    JPG,        // JPG format
}

 /**
  *  Represents a DTO for a NormalMap.
  *  N.B. All properties in the interface are optional so that an initialization object can be used to construct the concrete class.
  *  @interface
  */
export interface INormalMap extends IGeneratedFileModel {

    id?: number;
    name?: string;
    description?: string;

    width?: number;
    height?: number;
    format?: NormalMapFormat;

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


