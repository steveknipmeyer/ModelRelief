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

    id: number;

    name: string;
    description: string;

    standardView: StandardView;
    fieldOfView: number;

    near: number;
    far: number;

    boundClippingPlanes: boolean;

    positionX: number;
    positionY: number;
    positionZ: number;

    lookAtX: number;
    lookAtY: number;
    lookAtZ: number;

    // Navigation Properties
    projectId: number;
    project: IProject;
}

/**
*  Concrete implementation of IDepthBuffer.
*  @interface
*/
export class DepthBuffer implements IDepthBuffer {

    id: number;

    name: string;
    description: string;

    format: DepthBufferFormat;

    // Navigation Properties
    projectId: number;
    project: IProject;

    model3dId: number;
    model3d: IModel3d;

    cameraId: number;
    camera: ICamera;

    // not exposed in UX; API only
    fileTimeStamp: Date;
    fileIsSynchronized: boolean;
}

/**
*  Concrete implementation of IMesh.
*  @interface
*/
export class Mesh implements IMesh {

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

/**
*  Concrete implementation of IMeshTransform.
*  @interface
*/
export class MeshTransform implements IMeshTransform {

    id: number;

    name: string;
    description: string;

    depth: number;
    width: number;

    tau: number;
    sigmaGaussianBlur: number;
    sigmaGaussianSmooth: number;
    lambdaLinearScaling: number;

    // Navigation Properties
    projectId: number;
    project: IProject;
};

/**
*  Concrete implementation of IModel3d.
*  @interface
*/
export class Model3d implements IModel3d {

    id: number;

    name: string;
    description: string;

    format: Model3dFormat;

    // Navigation Properties
    projectId: number;
    project: IProject;

    cameraId: number;
    camera: ICamera;
}

/**
 * Concrete implementation of IProject.
 * @class
 */
export class Project implements IProject {

    id: number;

    name: string;
    description: string;
}
