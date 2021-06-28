
// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";

import {ICamera} from "Scripts/Api/V1/Interfaces/ICamera";
import {IFileModel} from "Scripts/Api/V1/Interfaces/IFileModel";
import {IProject} from "Scripts/Api/V1/Interfaces/IProject";

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

    format?: Model3dFormat;

    // Navigation Properties
    projectId?: number;
    project?: IProject;

    cameraId?: number;
    camera?: ICamera;

    // not exposed in UX; API only
    fileTimeStamp?: Date;
}


