// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { ICamera }          from 'ICamera'
import { IProject }         from 'IProject'
import { ITGetModel }       from 'ITGetModel'

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
 *  @interface
 */
export interface IModel3d extends ITGetModel {

    Id: number;

    Name: string;
    Description: string;

    Format: Model3dFormat;

    // Navigation Properties
    ProjectId: number;
    Project: IProject;

    CameraId: number;
    Camera: ICamera;
}


