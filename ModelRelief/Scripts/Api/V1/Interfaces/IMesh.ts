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

    id: number;

    name: string;
    description: string;

    Format: MeshFormat;

    // Navigation Properties
    ProjectId: number;
    pProject: IProject;

    cameraId: number;
    camera: ICamera;

    depthBufferId: number;
    depthBuffer: IDepthBuffer;

    meshTransformId: number;
    meshTransform: IMeshTransform;

    // not exposed in UX; API only
    fileTimeStamp: Date;
    fileIsSynchronized: boolean;
}


