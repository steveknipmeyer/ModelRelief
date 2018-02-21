// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE       from 'three'

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
 * @class Model
 * @implements {IModel}
 * @template T 
 */
export class Model<T extends IModel> implements IModel{

    id          : number;
    name        : string;  
    description : string;

    endPoint    : string;       // API endpoint

    /**
     * Creates an instance of Model.
     * @param {IModel} parameters 
     */
    constructor (parameters?: IModel) {

        let {
            id,
            name,
            description,
    
        } = parameters;

        this.id            = id;
        this.name          = name;
        this.description   = description;
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
     * @description Returns the derived instance of Model.
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
 * @class FileModel
 * @extends {Model<T>}
 * @implements {IFileModel}
 * @template T 
 */
export class FileModel<T extends IFileModel> extends Model<T> implements IFileModel{

    // not exposed in UX; API only
    fileTimeStamp: Date;

    /**
     * Creates an instance of FileModel.
     * @param {IModel} parameters 
     */
    constructor(parameters?: IFileModel) {

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

     /**
     * @description Gets the backing file as a string from a model.
     * // https://stackoverflow.com/questions/8936984/uint8array-to-string-in-javascript
     * @returns {Promise<string>} 
     */
    async getFileAsStringAsync() : Promise<string> {

        let exportTag = Services.timer.mark(`GET File (string): ${this.constructor.name}`);

        let fileByteArray = await this.getFileAsync();
        function byteToStringConverter() : Promise<string> {
            return new Promise<string>((resolve, reject) => {
                let blobBuffer = new Blob([new Uint8Array(fileByteArray)]);

                let fileReader = new FileReader();
                fileReader.onload = function(e) {
                    resolve((<any>e.target).result);
                };
    
                fileReader.readAsText(blobBuffer);
            })
        }
        let fileString = await byteToStringConverter();
        Services.timer.logElapsedTime(exportTag);       

        return fileString;
    }
}
/**
 * @description Base class for a generated file-backed DTO model.
 * @export
 * @class GeneratedFileModel
 * @extends {FileModel<T>}
 * @implements {IGeneratedFileModel}
 * @template T 
 */
export class GeneratedFileModel<T extends IGeneratedFileModel> extends FileModel<T> implements IGeneratedFileModel{

    // not exposed in UX; API only
    fileIsSynchronized: boolean;

    /**
     * Creates an instance of GeneratedFileModel.
     * @param {IGeneratedFile} parameters 
     */
    constructor(parameters?: IGeneratedFileModel) {

        super (parameters);

        this.fileIsSynchronized = parameters.fileIsSynchronized;
    }
}

/**
 * Concrete implementation of ICamera.
 * @class
 */
export class Camera extends Model<Camera> implements ICamera {

    fieldOfView: number;
    aspectRatio: number;    
    near: number;
    far: number;

    positionX: number;
    positionY: number;
    positionZ: number;

    eulerX: number;
    eulerY: number;
    eulerZ: number;
    theta: number;

    scaleX: number;
    scaleY: number;
    scaleZ: number;

    upX: number;
    upY: number;
    upZ: number;

    // Navigation Properties
    projectId: number;
    project: IProject;

    /**
     * Creates an instance of Camera.
     * @param {ICamera} parameters 
     */
    constructor (parameters: ICamera = {}) {

        super(parameters);

        this.endPoint = `${window.location.protocol}//${window.location.host}/${ServerEndPoints.ApiCameras}`;

        let {
            fieldOfView,
            aspectRatio,
            near,
            far,
        
            position,
            positionX,
            positionY,
            positionZ,
        
            quaternion,
            eulerX,
            eulerY,
            eulerZ,
            theta,

            scale,
            scaleX,
            scaleY,
            scaleZ,

            up,
            upX,
            upY,
            upZ,
                
            // Navigation Properties
            projectId,
            project,
        } = parameters;

        this.fieldOfView            = fieldOfView;    
        this.aspectRatio            = aspectRatio;
        this.near                   = near;
        this.far                    = far;
    
        this.positionX              = position ? position.x : positionX;
        this.positionY              = position ? position.y : positionY;
        this.positionZ              = position ? position.z : positionZ;
    
        this.eulerX                 = quaternion ? quaternion.x : eulerX;
        this.eulerY                 = quaternion ? quaternion.y : eulerY;
        this.eulerZ                 = quaternion ? quaternion.z : eulerZ;
        this.theta                  = quaternion ? quaternion.w : theta;

        this.scaleX                 = scale ? scale.x : scaleX;
        this.scaleY                 = scale ? scale.y : scaleY;
        this.scaleZ                 = scale ? scale.z : scaleZ;

        this.upX                    = up ? up.x : upX;
        this.upY                    = up ? up.y : upY;
        this.upZ                    = up ? up.z : upZ;
    
        // Navigation Properties
        this.projectId              = projectId;
        this.project                = project;
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
export class DepthBuffer extends GeneratedFileModel<DepthBuffer> implements IDepthBuffer {
    
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
    constructor (parameters: IDepthBuffer = {}) {

        super(parameters);

        this.endPoint = `${window.location.protocol}//${window.location.host}/${ServerEndPoints.ApiDepthBuffers}`;

        let {
            width,
            height,
            format,
        
            // Navigation Properties
            projectId,
            project,
        
            model3dId,
            model3d,
        
            cameraId,
            camera,
        } = parameters;

        this.width      = width;
        this.height     = height;
        this.format     = format;

        // Navigation Properties
        this.projectId  = projectId;
        this.project    = project;
    
        this.model3dId  = model3dId;
        this.model3d    = model3d;
    
        this.cameraId   = cameraId;
        this.camera     = camera;
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
export class Mesh extends GeneratedFileModel<Mesh> implements IMesh {
    
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
    constructor (parameters: IMesh = {}) {

        super(parameters);

        this.endPoint = `${window.location.protocol}//${window.location.host}/${ServerEndPoints.ApiMeshes}`;
 
        let {
            format,

            // Navigation Properties
            projectId,
            project,
        
            cameraId,
            camera,
        
            depthBufferId,
            depthBuffer,
        
            meshTransformId,
            meshTransform,
        } = parameters;            

        this.format         = format;

        // Navigation Properties
        this.projectId      = projectId;
        this.project        = project;
    
        this.cameraId       = cameraId;
        this.camera         = camera;
    
        this.depthBufferId  = depthBufferId;
        this.depthBuffer    = depthBuffer;
    
        this.meshTransformId  = meshTransformId;
        this.meshTransform    = meshTransform;
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
    constructor (parameters: IMeshTransform = {}) {

        super(parameters);

        this.endPoint = `${window.location.protocol}//${window.location.host}/${ServerEndPoints.ApiMeshTransforms}`;

        let {
            width,
            height,
            depth,
        
            tau,
            sigmaGaussianBlur,
            sigmaGaussianSmooth,
            lambdaLinearScaling,
        
            // Navigation Properties
            projectId,
            project,
        } = parameters;

        this.width  = width;
        this.height = height;
        this.depth  = depth;

        this.tau                    = tau;
        this.sigmaGaussianBlur      = sigmaGaussianBlur;
        this.sigmaGaussianSmooth    = sigmaGaussianSmooth;
        this.lambdaLinearScaling    = lambdaLinearScaling;
    
        // Navigation Properties
        this.projectId              = projectId;
        this.project                = project;
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
    constructor (parameters: IModel3d = {}) {

        super(parameters);

        this.endPoint = `${window.location.protocol}//${window.location.host}/${ServerEndPoints.ApiModels}`;

        let {
            format,

            // Navigation Properties
            projectId,
            project,
        
            cameraId,
            camera,
        } = parameters;

        this.format       = format;

        // Navigation Properties
        this.projectId    = projectId;
        this.project      = project;
    
        this.cameraId     = cameraId;
        this.camera       = camera;
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
    constructor (parameters: IProject = {}) {

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
