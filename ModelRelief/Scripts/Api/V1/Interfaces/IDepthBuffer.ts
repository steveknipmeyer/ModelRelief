// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { ICamera }          from 'ICamera'
import { IModel3d }         from 'IModel3d'
import { IProject }         from 'IProject'
import { ITGetModel }       from 'ITGetModel'

 /**
 *  Depth buffer file formats.
 *  @enum {number}
 */
export enum DepthBufferFormat {
    None,       // unknown
    RAW,        // floating point array
    PNG,        // PNG format
    JPG,        // JPG format
}

 /**
 *  Represents a DTO for a DepthBuffer.
 *  @interface
 */
export interface IDepthBuffer extends ITGetModel {

    Id: number;

    Name: string;
    Description: string;

    Format: DepthBufferFormat;

    // Navigation Properties
    ProjectId: number;
    Project: IProject;

    Model3dId: number;
    Model3d: IModel3d;

    CameraId: number;
    Camera: ICamera;

    // not exposed in UX; API only
    FileTimeStamp: Date;
    FileIsSynchronized: boolean;
}


