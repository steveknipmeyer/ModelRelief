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

    /**
     * Creates an instance of Camera.
     * @param {ICamera} parameters 
     */
    constructor (parameters: ICamera) {

        this.id                     = parameters.id || undefined;
        this.name                   = parameters.name || undefined;
        this.description            = parameters.description || undefined;

        this.standardView           = parameters.standardView || undefined;
        this.fieldOfView            = parameters.fieldOfView  || undefined;    
    
        this.near                   = parameters.near || undefined;
        this.far                    = parameters.far || undefined;
    
        this.boundClippingPlanes    = parameters.boundClippingPlanes || undefined;
    
        this.positionX              = parameters.position ? parameters.position.x : (parameters.positionX ? parameters.positionX : undefined); 
        this.positionY              = parameters.position ? parameters.position.y : (parameters.positionY ? parameters.positionY : undefined); 
        this.positionZ              = parameters.position ? parameters.position.z : (parameters.positionZ ? parameters.positionZ : undefined); 
    
        this.lookAtX                = parameters.lookAt ? parameters.lookAt.x : (parameters.lookAtX ? parameters.lookAtX : undefined); 
        this.lookAtY                = parameters.lookAt ? parameters.lookAt.y : (parameters.lookAtY ? parameters.lookAtY : undefined); 
        this.lookAtZ                = parameters.lookAt ? parameters.lookAt.z : (parameters.lookAtZ ? parameters.lookAtZ : undefined); 
    
        // Navigation Properties
        this.projectId              = parameters.projectId || undefined;
        this.project                = parameters.project || undefined;
        }
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

    /**
     * Creates an instance of DepthBuffer.
     * @param {IDepthBuffer} parameters 
     */
    constructor (parameters: IDepthBuffer) {

        this.id                     = parameters.id || undefined;
        this.name                   = parameters.name || undefined;
        this.description            = parameters.description || undefined;
    
        this.format                 = parameters.format|| undefined;
    
        // Navigation Properties
        this.projectId              = parameters.projectId || undefined;
        this.project                = parameters.project || undefined;
    
        this.model3dId              = parameters.model3dId || undefined;
        this.model3d                = parameters.model3d || undefined;
    
        this.cameraId               = parameters.cameraId || undefined;
        this.camera                 = parameters.camera || undefined;
    
        // not exposed in UX; API only
        this.fileTimeStamp          = parameters.fileTimeStamp || undefined;
        this.fileIsSynchronized     = parameters.fileIsSynchronized || undefined;
    }
}

/**
*  Concrete implementation of IMesh.
*  @interface
*/
export class Mesh implements IMesh {

    id: number;
    name: string;
    description: string;

    format: MeshFormat;

    // Navigation Properties
    projectId: number;
    project: IProject;

    cameraId: number;
    camera: ICamera;

    depthBufferId: number;
    depthBuffer: IDepthBuffer;

    meshTransformId: number;
    meshTransform: IMeshTransform;

    // not exposed in UX; API only
    fileTimeStamp: Date;
    fileIsSynchronized: boolean;

    /**
     * Creates an instance of a Mesh.
     * @param {Mesh} parameters 
     */
    constructor (parameters: IMesh) {

        this.id                     = parameters.id || undefined;
        this.name                   = parameters.name || undefined;
        this.description            = parameters.description || undefined;

        this.format                 = parameters.format || undefined;

        // Navigation Properties
        this.projectId              = parameters.projectId || undefined;
        this.project                = parameters.project || undefined;
    
        this.cameraId               = parameters.cameraId || undefined;
        this.camera                 = parameters.camera || undefined;
    
        this.depthBufferId          = parameters.depthBufferId || undefined;
        this.depthBuffer            = parameters.depthBuffer || undefined;
    
        this.meshTransformId        = parameters.meshTransformId || undefined;
        this.meshTransform          = parameters.meshTransform || undefined;
    
        // not exposed in UX; API only
        this.fileTimeStamp          = parameters.fileTimeStamp || undefined;
        this.fileIsSynchronized     = parameters.fileIsSynchronized || undefined;    
    }
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

    /**
     * Creates an instance of a MeshTransform.
     * @param {IMeshTransform} parameters 
     */
    constructor (parameters: IMeshTransform) {

        this.id                     = parameters.id || undefined;
        this.name                   = parameters.name || undefined;
        this.description            = parameters.description || undefined;

        this.depth                  = parameters.depth || undefined;
        this.width                  = parameters.width || undefined;
    
        this.tau                    = parameters.tau || undefined;
        this.sigmaGaussianBlur      = parameters.sigmaGaussianBlur || undefined;
        this.sigmaGaussianSmooth    = parameters.sigmaGaussianSmooth || undefined;
        this.lambdaLinearScaling    = parameters.lambdaLinearScaling || undefined;
    
        // Navigation Properties
        this.projectId              = parameters.projectId || undefined;
        this.project                = parameters.project || undefined;
        }
    
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

    /**
     * Creates an instance of a Model3d.
     * @param {IModel3d} parameters 
     */
    constructor (parameters: IModel3d) {

        this.id           = parameters.id || undefined;
        this.name         = parameters.name || undefined;
        this.description  = parameters.description || undefined;

        this.format       = parameters.format || undefined;

        // Navigation Properties
        this.projectId    = parameters.projectId || undefined;
        this.project      = parameters.project || undefined;
    
        this.cameraId     = parameters.cameraId || undefined;
        this.camera       = parameters.camera || undefined;
        }
}

/**
 * Concrete implementation of IProject.
 * @class
 */
export class Project implements IProject {

    id: number;
    name: string;
    description: string;

    /**
     * Creates an instance of a Project.
     * @param {Project} parameters 
     */
    constructor (parameters: IProject) {

        this.id           = parameters.id || undefined;
        this.name         = parameters.name || undefined;
        this.description  = parameters.description || undefined;
    }
}
