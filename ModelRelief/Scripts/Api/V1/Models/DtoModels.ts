// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { ICamera, StandardView }            from 'ICamera'
import { IDepthBuffer, DepthBufferFormat }  from 'IDepthBuffer'
import {ContentType, HttpLibrary, 
        MethodType, ServerEndPoints}        from 'Http'
import { IGeneratedFileModel }              from 'IGeneratedFileModel'
import { IMesh, MeshFormat }                from 'IMesh'
import { IMeshTransform }                   from 'IMeshTransform'
import { IFileModel }                       from 'IFileModel'
import { IModel }                           from 'IModel'
import { IModel3d, Model3dFormat }          from 'IModel3d'
import { IProject }                         from 'IProject'
import { Services }                         from 'Services'
import { RequestResponse }                  from 'RequestResponse'

/**
 * @description Common base class for all DTO models.
 * @export
 * @class Base
 * @implements {IModel}
 * @template T 
 */
export class Model<T extends IModel> implements IModel{

    id          : number;
    name        : string;  
    description : string;

    endPoint    : string;       // API endpoint

    /**
     * Creates an instance of Base.
     * @param {IModel} parameters 
     */
    constructor (parameters: IModel) {

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
     * @description Returns the derived instance of BaseModel.
     * @param {IModel} parameters 
     * @returns {*} 
     */
    factory(parameters : IModel) : any{};

    /**
     * @description Posts the model to its API endpoint.
     * @returns {Promise<T>} 
     */
    async postAsync() : Promise<T> {

        let newModel = JSON.stringify(this);
        let result = await this.submitRequestAsync(this.endPoint, MethodType.Post, ContentType.Json, newModel);

        return this.factory(result.model) as T;
    }

    /**
     * @description Gets the model from its API endpoint.
     * @returns {Promise<T>} 
     */
    async getAsync() : Promise<T> {

        let endPoint = `${this.endPoint}/${this.id}`;
        let result = await this.submitRequestAsync(endPoint, MethodType.Get, ContentType.Json, null);

        return this.factory(result.model) as T
    }
    
    /**
     * @description Puts the model to its API endpoint.
     * @returns {Promise<T>} 
     */
    async putAsync() : Promise<T> {

        let updatedModel = JSON.stringify(this);
        let endPoint = `${this.endPoint}/${this.id}`;
        let result = await this.submitRequestAsync(endPoint, MethodType.Put, ContentType.Json, updatedModel);

        return this.factory(result.model) as T;
    }
}

/**
 * @description Base class for a file-backed DTO model.
 * @export 
 * @class FileBaseModel
 * @extends {Model<T>}
 * @implements {IModel}
 * @template T 
 */
export class FileModel<T extends IFileModel> extends Model<T> implements IFileModel{

    // not exposed in UX; API only
    fileTimeStamp: Date;

    /**
     * Creates an instance of FileBaseModel.
     * @param {IModel} parameters 
     */
    constructor(parameters: IFileModel) {

        super (parameters);

        this.fileTimeStamp = parameters.fileTimeStamp || undefined;
    }

    /**
     * @description Posts the model and a backing file to its API endpoint.
     * @returns {Promise<T>} 
     */
    async postFileAsync(fileData : any) : Promise<T> {

        let exportTag = Services.timer.mark(`POST File: ${this.constructor.name}`);

        let newModel = await HttpLibrary.postFileAsync (this.endPoint, fileData, this);

        Services.timer.logElapsedTime(exportTag);       

        return this.factory(newModel) as T;
    }

    /**
     * @description Gets the backing file from a model.
     * @returns {Promise<UInt8Array>} 
     */
    async getFileAsync() : Promise<Uint8Array> {

        let exportTag = Services.timer.mark(`GET File: ${this.constructor.name}`);

        let endPoint = `${this.endPoint}/${this.id}/file`
        let result = await this.submitRequestAsync(endPoint, MethodType.Get, ContentType.OctetStream, null);       
        let byteArray = result.byteArrayDecodedDoublePrime;
//      let byteArray = result.byteArrayDecoded;

        Services.timer.logElapsedTime(exportTag);       

        return byteArray;
    }
}

/**
 * @description Base class for a generated file-backed DTO model.
 * @export
 * @class GeneratedFileBaseModel
 * @extends {FileModel<T>}
 * @implements {IGeneratedFile}
 * @template T 
 */
export class GeneratedFileBaseModel<T extends IGeneratedFileModel> extends FileModel<T> implements IGeneratedFileModel{

    // not exposed in UX; API only
    fileIsSynchronized: boolean;

    /**
     * Creates an instance of GeneratedFileBaseModel.
     * @param {IGeneratedFile} parameters 
     */
    constructor(parameters: IGeneratedFileModel) {

        super (parameters);

        this.fileIsSynchronized = parameters.fileIsSynchronized || undefined;
    }
}

/**
 * Concrete implementation of ICamera.
 * @class
 */
export class Camera extends Model<Camera> implements ICamera {

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

    /**
     * @description Constructs an instance of a Camera.
     * @param {IModel} parameters : Dto.Camera
     * @returns {Camera} 
     */
    factory (parameters: IModel) : Camera {
        return new Camera(parameters);
    }
}

/**
*  Concrete implementation of IDepthBuffer.
*  @interface
*/
export class DepthBuffer extends GeneratedFileBaseModel<DepthBuffer> implements IDepthBuffer {
    
    width: number;
    height: number;
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

        this.width                  = parameters.width || undefined;
        this.height                 = parameters.height || undefined;
        this.format                 = parameters.format|| undefined;
    
        // Navigation Properties
        this.projectId              = parameters.projectId || undefined;
        this.project                = parameters.project || undefined;
    
        this.model3dId              = parameters.model3dId || undefined;
        this.model3d                = parameters.model3d || undefined;
    
        this.cameraId               = parameters.cameraId || undefined;
        this.camera                 = parameters.camera || undefined;
    }

    /**
     * @description Constructs an instance of a DepthBuffer
     * @param {IModel} parameters : Dto.DepthBuffer
     * @returns {DepthBuffer} 
     */
    factory (parameters: IModel) : DepthBuffer {
        return new DepthBuffer(parameters);
    }
}

/**
*  Concrete implementation of IMesh.
*  @interface
*/
export class Mesh extends GeneratedFileBaseModel<Mesh> implements IMesh {
    
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
    
    /**
     * @description Constructs an instance of a Mesh.
     * @param {IModel} parameters : Dto.Mesh
     * @returns {Mesh} 
     */
    factory (parameters: IModel) : Mesh {
        return new Mesh(parameters);
    }
}

/**
*  Concrete implementation of IMeshTransform.
*  @interface
*/
export class MeshTransform extends Model<MeshTransform> implements IMeshTransform {

    width: number;
    height: number;
    depth: number;

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

        this.width                  = parameters.width || undefined;
        this.height                 = parameters.height || undefined;
        this.depth                  = parameters.depth || undefined;
    
        this.tau                    = parameters.tau || undefined;
        this.sigmaGaussianBlur      = parameters.sigmaGaussianBlur || undefined;
        this.sigmaGaussianSmooth    = parameters.sigmaGaussianSmooth || undefined;
        this.lambdaLinearScaling    = parameters.lambdaLinearScaling || undefined;
    
        // Navigation Properties
        this.projectId              = parameters.projectId || undefined;
        this.project                = parameters.project || undefined;
        }
    
    /**
     * @description Constructs an instance of a MeshTransform.
     * @param {IModel} parameters : Dto.MeshTransform
     * @returns {MeshTransform} 
     */
    factory (parameters: IModel) : MeshTransform {
        return new MeshTransform(parameters);
    }
};

/**
*  Concrete implementation of IModel3d.
*  @interface
*/
export class Model3d extends FileModel<Model3d> implements IModel3d {

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

    /**
     * @description Constructs an instance of a Model3d.
     * @param {IModel} parameters : Dto.Model3d
     * @returns {Model3d} 
     */
    factory (parameters: IModel) : Model3d {
        return new Model3d(parameters);
    }    
}

/**
 * Concrete implementation of IProject.
 * @class
 */
export class Project extends Model<Project> implements IProject {

    /**
     * Creates an instance of a Project.
     * @param {Project} parameters 
     */
    constructor (parameters: IProject) {

        super(parameters);

        this.endPoint = `${window.location.protocol}//${window.location.host}/${ServerEndPoints.ApiProjects}`;
    }
    /**
     * @description Constructs an instance of a Project.
     * @param {IModel} parameters : Dto.Project
     * @returns {Project} 
     */
    factory (parameters: IModel) : Project {
        return new Project(parameters);
    }
}
