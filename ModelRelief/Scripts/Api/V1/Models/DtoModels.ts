// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { ICamera, StandardView }            from 'ICamera'
import { IDepthBuffer, DepthBufferFormat }  from 'IDepthBuffer'
import { IMesh, MeshFormat }                from 'IMesh'
import { IMeshTransform }                   from 'IMeshTransform'
import { IModel3d, Model3dFormat }          from 'IModel3d'
import { IProject }                         from 'IProject'

/**
 * Concrete implementation of ICamera.
 * @class
 */
export class Camera implements ICamera {

    Id: number;

    Name: string;
    Description: string;

    StandardView: StandardView;
    FieldOfView: number;

    Near: number;
    Far: number;

    BoundClippingPlanes: boolean;

    PositionX: number;
    PositionY: number;
    PositionZ: number;

    LookAtX: number;
    LookAtY: number;
    LookAtZ: number;

    // Navigation Properties
    ProjectId: number;
    Project: Project;
}

/**
*  Concrete implementation of IDepthBuffer.
*  @interface
*/
export class DepthBuffer implements IDepthBuffer {

    Id: number;

    Name: string;
    Description: string;

    Format: DepthBufferFormat;

    // Navigation Properties
    ProjectId: number;
    Project: Project;

    Model3dId: number;
    Model3d: Model3d;

    CameraId: number;
    Camera: Camera;

    // not exposed in UX; API only
    FileTimeStamp: Date;
    FileIsSynchronized: boolean;
}

/**
*  Concrete implementation of IMesh.
*  @interface
*/
export class Mesh implements IMesh {

    Id: number;

    Name: string;
    Description: string;

    Format: MeshFormat;

    // Navigation Properties
    ProjectId: number;
    Project: Project;

    CameraId: number;
    Camera: Camera;

    DepthBufferId: number;
    DepthBuffer: DepthBuffer;

    MeshTransformId: number;
    MeshTransform: MeshTransform;

    // not exposed in UX; API only
    FileTimeStamp: Date;
    FileIsSynchronized: boolean;
}

/**
*  Concrete implementation of IMeshTransform.
*  @interface
*/
export class MeshTransform implements IMeshTransform {

    Id: number;

    Name: string;
    Description: string;

    Depth: number;
    Width: number;

    Tau: number;
    SigmaGaussianBlur: number;
    SigmaGaussianSmooth: number;
    LambdaLinearScaling: number;

    // Navigation Properties
    ProjectId: number;
    Project: Project;
};

/**
*  Concrete implementation of IModel3d.
*  @interface
*/
export class Model3d implements IModel3d {

    Id: number;

    Name: string;
    Description: string;

    Format: Model3dFormat;

    // Navigation Properties
    ProjectId: number;
    Project: Project;

    CameraId: number;
    Camera: Camera;
}

/**
 * Concrete implementation of IProject.
 * @class
 */
export class Project implements IProject {

    Id: number;

    Name: string;
    Description: string;
}
