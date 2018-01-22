// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { ICamera }          from 'ICamera'
import { IDepthBuffer }     from 'IDepthBuffer'
import { IMeshTransform }   from 'IMeshTransform'
import { IProject }         from 'IProject'
import { ITGetModel }       from 'ITGetModel'

 /**
 *  Mesh file formats.
 *  @enum {number}
 */
export enum MeshFormat {
    None,           // unknown
    RAW,            // floating point array
    OBJ,            // Wavefront OBJ
    STL,            // Stereolithography
}

 /**
 *  Represents a DTO for a Mesh.
 *  @interface
 */
export interface IMesh extends ITGetModel {

    Id: number;

    Name: string;
    Description: string;

    Format: MeshFormat;

    // Navigation Properties
    ProjectId: number;
    Project: IProject;

    CameraId: number;
    Camera: ICamera;

    DepthBufferId: number;
    DepthBuffer: IDepthBuffer;

    MeshTransformId: number;
    MeshTransform: IMeshTransform;

    // not exposed in UX; API only
    FileTimeStamp: Date;
    FileIsSynchronized: boolean;
}


