// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { ICamera }from 'ICamera'
import { IModel3d }         from 'IModel3d'
import { IProject }         from 'IProject'
import { IModel }           from 'IModel'

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
 *  N.B. All properties in the interface are optional so that an initialization object can be used to construct the concrete class.
 *  @interface
 */
export interface IDepthBuffer extends IModel {

    id?: number;
    name?: string;
    description?: string;

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


