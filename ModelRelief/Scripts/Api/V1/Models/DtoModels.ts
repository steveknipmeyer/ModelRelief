// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { ICamera, StandardView }            from 'ICamera'
import { IDepthBuffer, DepthBufferFormat }  from 'IDepthBuffer'
import {ContentType, HttpLibrary, 
        MethodType, ServerEndPoints, 
        RequestResponse}                    from "Http"
import { IMesh, MeshFormat }                from 'IMesh'
import { IMeshTransform }                   from 'IMeshTransform'
import { IModel3d, Model3dFormat }          from 'IModel3d'
import { IProject }                         from 'IProject'
import {Services}                           from 'Services'
import { ITGetModel, IGeneratedFile }                       from 'ITGetModel'

/**
 * @description Common base class for all DTO models.
 * @export
 * @class Base
 * @implements {ITGetModel}
 * @template T 
 */
export class BaseModel<T extends ITGetModel> implements ITGetModel{

    id          : number;
    name        : string;  
    description : string;

    endPoint    : string;       // API endpoint

    /**
     * Creates an instance of Base.
     * @param {ITGetModel} parameters 
     */
    constructor (parameters: ITGetModel) {

        this.id            = parameters.id || undefined;
        this.name          = parameters.name || undefined;
        this.description   = parameters.description || undefined;
    }        

    /**
     * @description Submits an HTTP request to its API endpoint.
     * @param {string} endPoint API endpoint
     * @param {MethodType} requestType HTTP method.
     * @param {ContentType} contentType MIME type (e.g. JSON, octet-stream)
     * @param {*} requestData Data to send (or null)
     * @returns {Promise<RequestResponse>} 
     */
    async submitRequestAsync(endPoint: string, requestType : MethodType, contentType : ContentType, requestData : any) : Promise<RequestResponse> {

        let exportTag = Services.timer.mark(`${requestType} ${this.constructor.name}`);

        let result = await HttpLibrary.submitHttpRequestAsync(endPoint, requestType, contentType, requestData);

        Services.timer.logElapsedTime(exportTag);

        return result;
    }

    /**
     * @description Posts the model to its API endpoint.
     * @returns {Promise<T>} 
     */
    async postAsync() : Promise<T> {

        let newModel = JSON.stringify(this);
        let result = await this.submitRequestAsync(this.endPoint, MethodType.Post, ContentType.Json, newModel);

        return result.model as T;
    }
}

/**
 * @description Base class for a file-backed DTO model.
 * @export 
 * @class FileBaseModel
 * @extends {BaseModel<T>}
 * @implements {ITGetModel}
 * @template T 
 */
export class FileBaseModel<T> extends BaseModel<T> {

    // not exposed in UX; API only
    fileTimeStamp: Date;

    /**
     * Creates an instance of FileBaseModel.
     * @param {ITGetModel} parameters 
     */
    constructor(parameters: ITGetModel) {

        super (parameters);
    }

    /**
     * @description Posts the model and a backing file to its API endpoint.
     * @returns {Promise<T>} 
     */
    async postFileAsync(fileData : any) : Promise<T> {

        let exportTag = Services.timer.mark(`POST File: ${this.constructor.name}`);

        let fileName = `${this.name}`;
        let newModel = await HttpLibrary.postFileAsync (this.endPoint, fileData, this);

        Services.timer.logElapsedTime(exportTag);       

        return newModel as T;
    }
}

/**
 * @description Base class for a generated file-backed DTO model.
 * @export
 * @class GeneratedFileBaseModel
 * @extends {FileBaseModel<T>}
 * @implements {IGeneratedFile}
 * @template T 
 */
export class GeneratedFileBaseModel<T> extends FileBaseModel<T> implements IGeneratedFile{

    // not exposed in UX; API only
    fileIsSynchronized: boolean;

    /**
     * Creates an instance of GeneratedFileBaseModel.
     * @param {IGeneratedFile} parameters 
     */
    constructor(parameters: IGeneratedFile) {

        super (parameters);

        this.fileIsSynchronized = parameters.fileIsSynchronized || undefined;
    }
}

/**
 * Concrete implementation of ICamera.
 * @class
 */
export class Camera extends BaseModel<Camera> implements ICamera {

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

        super(parameters);

        this.endPoint = `${window.location.protocol}//${window.location.host}/${ServerEndPoints.ApiCameras}`;

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
export class DepthBuffer extends GeneratedFileBaseModel<DepthBuffer> implements IDepthBuffer {

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

    /**
     * Creates an instance of DepthBuffer.
     * @param {IDepthBuffer} parameters 
     */
    constructor (parameters: IDepthBuffer) {

        super(parameters);

        this.endPoint = `${window.location.protocol}//${window.location.host}/${ServerEndPoints.ApiDepthBuffers}`;
    
        this.format                 = parameters.format|| undefined;
    
        // Navigation Properties
        this.projectId              = parameters.projectId || undefined;
        this.project                = parameters.project || undefined;
    
        this.model3dId              = parameters.model3dId || undefined;
        this.model3d                = parameters.model3d || undefined;
    
        this.cameraId               = parameters.cameraId || undefined;
        this.camera                 = parameters.camera || undefined;
    }
}

/**
*  Concrete implementation of IMesh.
*  @interface
*/
export class Mesh extends GeneratedFileBaseModel<Mesh> implements IMesh {

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

    /**
     * Creates an instance of a Mesh.
     * @param {Mesh} parameters 
     */
    constructor (parameters: IMesh) {

        super(parameters);

        this.endPoint = `${window.location.protocol}//${window.location.host}/${ServerEndPoints.ApiMeshes}`;

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
    }
}

/**
*  Concrete implementation of IMeshTransform.
*  @interface
*/
export class MeshTransform extends BaseModel<MeshTransform> implements IMeshTransform {

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

        super(parameters);

        this.endPoint = `${window.location.protocol}//${window.location.host}/${ServerEndPoints.ApiMeshTransforms}`;

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
export class Model3d extends FileBaseModel<Model3d> implements IModel3d {

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

        super(parameters);

        this.endPoint = `${window.location.protocol}//${window.location.host}/${ServerEndPoints.ApiModels}`;

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
export class Project extends BaseModel<Project> implements IProject {

    static EndPoint = `${window.location.protocol}//${window.location.host}/${ServerEndPoints.ApiProjects}`;

    id: number;
    name: string;
    description: string;

    /**
     * Creates an instance of a Project.
     * @param {Project} parameters 
     */
    constructor (parameters: IProject) {

        super(parameters);

        this.endPoint = `${window.location.protocol}//${window.location.host}/${ServerEndPoints.ApiProjects}`;
    }
}
