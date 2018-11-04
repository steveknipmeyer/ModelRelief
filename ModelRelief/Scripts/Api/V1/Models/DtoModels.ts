// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {ICamera} from "Scripts/Api/V1/Interfaces/ICamera";
import {DepthBufferFormat, IDepthBuffer} from "Scripts/Api/V1/Interfaces/IDepthBuffer";
import {IFileModel} from "Scripts/Api/V1/Interfaces/IFileModel";
import {IGeneratedFileModel} from "Scripts/Api/V1/Interfaces/IGeneratedFileModel";
import {IMesh, MeshFormat} from "Scripts/Api/V1/Interfaces/IMesh";
import {IMeshTransform} from "Scripts/Api/V1/Interfaces/IMeshTransform";
import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {IModel3d, Model3dFormat} from "Scripts/Api/V1/Interfaces/IModel3d";
import {IProject} from "Scripts/Api/V1/Interfaces/IProject";
import {IThreeBaseCamera} from "Scripts/Graphics/IThreeBaseCamera";
import {Exception} from "Scripts/System/Exception";
import {ContentType, HttpLibrary, MethodType, ServerEndPoints} from "Scripts/System/Http";
import {HttpStatusCode} from "Scripts/System/HttpStatus";
import {ILogger} from "Scripts/System/Logger";
import {RequestResponse} from "Scripts/System/RequestResponse";
import {Services} from "Scripts/System/Services";
import * as THREE from "three";

// ---------------------------------------------------------------------------------------------------------------------------------------------//
//                                                              Base Classes                                                                    //
// ---------------------------------------------------------------------------------------------------------------------------------------------//
/**
 * @description Common base class for all DTO models.
 * @export
 * @class Model
 * @implements {IModel}
 * @template T
 */
export class Model<T extends IModel> implements IModel {

    public id: number;
    public name: string;
    public description: string;

    public endPoint: string;       // API endpoint

    // Private
    private _logger: ILogger;

    /**
     * Creates an instance of Model.
     * @param {IModel} [parameters] Initialization parameters.
     */
    constructor(parameters: IModel = {}) {

        const {
            id,
            name,
            description,

        } = parameters;

        this.id            = id;
        this.name          = name;
        this.description   = description;

        this._logger = Services.defaultLogger;
    }

    /**
     * @description Submits an HTTP request to its API endpoint.
     * @param {string} endPoint API endpoint
     * @param {MethodType} requestType HTTP method.
     * @param {ContentType} contentType MIME type (e.g. JSON, octet-stream)
     * @param {*} requestData Data to send (or null)
     * @returns {Promise<RequestResponse>}
     */
    public async submitRequestAsync(endPoint: string, requestType: MethodType, contentType: ContentType, requestData: any): Promise<RequestResponse> {

        const exportTag = Services.timer.mark(`${requestType} ${this.constructor.name}`);

        const result = await HttpLibrary.submitHttpRequestAsync(endPoint, requestType, contentType, requestData);

        Services.timer.logElapsedTime(exportTag);

        return result;
    }
    /**
     * @description Returns the derived instance of Model.
     * @param {IModel} parameters
     * @returns {*}
     */
    public factory(parameters: IModel): any {
    }

    /**
     * @description Posts the model to its API endpoint.
     * @returns {Promise<T>}
     */
    public async postAsync(): Promise<T> {

        const newModel = JSON.stringify(this);
        const result = await this.submitRequestAsync(this.endPoint, MethodType.Post, ContentType.Json, newModel);
        if (result.response.status !== HttpStatusCode.CREATED)
            Exception.throwError(`postFileAsync model: Url = ${this.endPoint}, status = ${result.response.status}`);

        return this.factory(result.model) as T;
    }

    /**
     * @description Gets the model from its API endpoint.
     * @returns {Promise<T>}
     */
    public async getAsync(): Promise<T> {

        if (!this.id)
            return undefined;

        const endPoint = `${this.endPoint}/${this.id}`;
        const result = await this.submitRequestAsync(endPoint, MethodType.Get, ContentType.Json, null);

        return this.factory(result.model) as T;
    }

    /**
     * @description Puts the model to its API endpoint.
     * @returns {Promise<T>}
     */
    public async putAsync(): Promise<T> {

        const updatedModel = JSON.stringify(this);
        const endPoint = `${this.endPoint}/${this.id}`;
        const result = await this.submitRequestAsync(endPoint, MethodType.Put, ContentType.Json, updatedModel);

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
export class FileModel<T extends IFileModel> extends Model<T> implements IFileModel {

    // not exposed in UX; API only
    public fileTimeStamp: Date;

    // Private
    private fileArray: Uint8Array;
    private fileString: string;

    /**
     * Creates an instance of FileModel.
     * @param {IModel} [parameters] Initialization parameters.
     */
    constructor(parameters: IFileModel = {}) {

        super (parameters);

        this.fileTimeStamp = parameters.fileTimeStamp || undefined;
    }

    /**
     * @description Returns the HTTP endpoint for a file request.
     * @readonly
     * @type {string}
     */
    get fileEndPoint(): string {
        return `${this.endPoint}/${this.id}/file`;
    }

    /**
     * @description Posts the model and a backing file to its API endpoint.
     * @returns {Promise<T>}
     */
    public async postFileAsync(fileData: any): Promise<T> {

        const exportTag = Services.timer.mark(`POST File: ${this.constructor.name}`);

        const newModel = await HttpLibrary.postFileAsync (this.fileEndPoint, fileData);

        Services.timer.logElapsedTime(exportTag);

        return this.factory(newModel) as T;
    }

    /**
     * @description Gets the backing file from a model.
     * @returns {Promise<UInt8Array>}
     */
    public async getFileAsync(): Promise<Uint8Array> {

        const exportTag = Services.timer.mark(`GET File: ${this.constructor.name}`);

        // cache
        if (this.fileArray)
            return this.fileArray;

        const result = await this.submitRequestAsync(this.fileEndPoint, MethodType.Get, ContentType.OctetStream, null);
        this.fileArray = result.byteArrayDecodedDoublePrime;
//      this._fileArray = result.byteArrayDecoded;

        Services.timer.logElapsedTime(exportTag);

        return this.fileArray;
    }

     /**
      * @description Gets the backing file as a string from a model.
      * // https://stackoverflow.com/questions/8936984/uint8array-to-string-in-javascript
      * @returns {Promise<string>}
      */
    public async getFileAsStringAsync(): Promise<string> {

        const exportTag = Services.timer.mark(`GET File (string): ${this.constructor.name}`);

        // cache
        if (this.fileString)
            return this.fileString;

        const fileByteArray = await this.getFileAsync();
        function byteToStringConverter(): Promise<string> {
            return new Promise<string>((resolve, reject) => {
                const blobBuffer = new Blob([new Uint8Array(fileByteArray)]);

                const fileReader = new FileReader();
                fileReader.onload = (e) => {
                    resolve((e.target as any).result);
                };

                fileReader.readAsText(blobBuffer);
            });
        }
        this.fileString = await byteToStringConverter();
        Services.timer.logElapsedTime(exportTag);

        return this.fileString;
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
export class GeneratedFileModel<T extends IGeneratedFileModel> extends FileModel<T> implements IGeneratedFileModel {

    // not exposed in UX; API only
    public fileIsSynchronized: boolean;

    /**
     * Creates an instance of GeneratedFileModel.
     * @param {IGeneratedFile} [parameters] Initialization parameters.
     */
    constructor(parameters: IGeneratedFileModel = {}) {

        super (parameters);

        this.fileIsSynchronized = parameters.fileIsSynchronized;
    }
}

// ---------------------------------------------------------------------------------------------------------------------------------------------//
//                                                              DTO Models                                                                      //
// ---------------------------------------------------------------------------------------------------------------------------------------------//
/**
 * Concrete implementation of ICamera.
 * @class
 */
export class Camera extends Model<Camera> implements ICamera {

    /**
     * @description Returns a Camera instance through an HTTP query of the Id.
     * @static
     * @param {number} id Camera Id.
     * @returns {Promise<BaseCamera>}
     */
    public static async fromIdAsync(id: number ): Promise<Camera> {

        if (!id)
            return undefined;

        const camera = new Camera ({
            id,
        });
        const cameraModel = await camera.getAsync();
        return cameraModel;
    }

    public isPerspective: boolean;

    public near: number;
    public far: number;

    public positionX: number;
    public positionY: number;
    public positionZ: number;

    public eulerX: number;
    public eulerY: number;
    public eulerZ: number;
    public theta: number;

    public scaleX: number;
    public scaleY: number;
    public scaleZ: number;

    public upX: number;
    public upY: number;
    public upZ: number;

    // Perspective
    public fieldOfView: number;
    public aspectRatio: number;

    // Orthographic
    public left: number;
    public right: number;
    public top: number;
    public bottom: number;

    // Navigation Properties
    public projectId: number;
    public project: IProject;

    /**
     * Creates an instance of Camera.
     * @param {ICamera} parameters
     */
    constructor(parameters: ICamera = {}) {

        super(parameters);

        this.endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiCameras}`;

        const {
            isPerspective,

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

            // Perspective
            fieldOfView,
            aspectRatio,

            // Orthographic
            left,
            right,
            top,
            bottom,

            // Navigation Properties
            projectId,
            project,
        } = parameters;

        this.isPerspective          = isPerspective;

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

        // Perspective
        this.fieldOfView            = fieldOfView;
        this.aspectRatio            = aspectRatio;

        // Orthographic
        this.left                   = left;
        this.right                  = right;
        this.top                    = top;
        this.bottom                 = bottom;

        // Navigation Properties
        this.projectId              = projectId;
        this.project                = project;
        }

    /**
     * @description Constructs an instance of a Camera.
     * @param {IModel} parameters : Dto.Camera
     * @returns {Camera}
     */
    public factory(parameters: IModel): Camera {
        return new Camera(parameters);
    }

    /**
     * @description Constructs an instance from a DTO model.
     * @returns {Camera}
     */
    public getViewCamera(): IThreeBaseCamera {

        const position    = new THREE.Vector3(this.positionX, this.positionY, this.positionZ);
        const quaternion  = new THREE.Quaternion(this.eulerX, this.eulerY, this.eulerZ, this.theta);
        const scale       = new THREE.Vector3(this.scaleX, this.scaleY, this.scaleZ);
        const up          = new THREE.Vector3(this.upX, this.upY, this.upZ);

        // construct from DTO properties
        const viewCamera = this.isPerspective ?
            new THREE.PerspectiveCamera(this.fieldOfView, this.aspectRatio, this.near, this.far) :
            new THREE.OrthographicCamera(this.left, this.right, this.top, this.bottom, this.near, this.far);

        viewCamera.matrix.compose(position, quaternion, scale);
        viewCamera.up.copy(up);

        // set position/rotation/scale attributes
        viewCamera.matrix.decompose(viewCamera.position, viewCamera.quaternion, viewCamera.scale);

        viewCamera.near   = this.near;
        viewCamera.far    = this.far;

        viewCamera.updateProjectionMatrix();

        return viewCamera;
    }
}

/**
 *  Concrete implementation of IDepthBuffer.
 *  @interface
 */
export class DepthBuffer extends GeneratedFileModel<DepthBuffer> implements IDepthBuffer {

    public width: number;
    public height: number;
    public format: DepthBufferFormat;

    // Navigation Properties
    public projectId: number;
    public project: IProject;

    public model3dId: number;
    public model3d: IModel3d;

    public cameraId: number;
    public camera: ICamera;

    /**
     * Creates an instance of DepthBuffer.
     * @param {IDepthBuffer} parameters
     */
    constructor(parameters: IDepthBuffer = {}) {

        super(parameters);

        this.endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiDepthBuffers}`;

        const {
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
    public factory(parameters: IModel): DepthBuffer {
        return new DepthBuffer(parameters);
    }
}

/**
 *  Concrete implementation of IMesh.
 *  @interface
 */
export class Mesh extends GeneratedFileModel<Mesh> implements IMesh {

    public format: MeshFormat;

    // Navigation Properties
    public projectId: number;
    public project: IProject;

    public cameraId: number;
    public camera: ICamera;

    public depthBufferId: number;
    public depthBuffer: IDepthBuffer;

    public meshTransformId: number;
    public meshTransform: IMeshTransform;

    /**
     * Creates an instance of a Mesh.
     * @param {Mesh} parameters
     */
    constructor(parameters: IMesh = {}) {

        super(parameters);

        this.endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiMeshes}`;

        const {
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
    public factory(parameters: IModel): Mesh {
        return new Mesh(parameters);
    }
}

/**
 *  Concrete implementation of IMeshTransform.
 *  @interface
 */
export class MeshTransform extends Model<MeshTransform> implements IMeshTransform {

    public width: number;
    public height: number;
    public depth: number;

    public gradientThreshold?: number;             // gradient threshold
    public attenuationFactor?: number;             // gradient attenuation (~a)
    public attenuationDecay?: number;              // gradient attenuation decay (b)
    public unsharpGaussianLow?: number;            // unsharp masking Gaussian low
    public unsharpGaussianHigh?: number;           // unsharp masking Gaussian high
    public unsharpHighFrequencyScale?: number;     // Unsharp masking high frequency scaling
    public p1?: number;                            // placeholder
    public p2?: number;                            // placeholder
    public p3?: number;                            // placeholder
    public p4?: number;                            // placeholder
    public p5?: number;                            // placeholder
    public p6?: number;                            // placeholder
    public p7?: number;                            // placeholder
    public p8?: number;                            // placeholder

    // Navigation Properties
    public projectId: number;
    public project: IProject;

    /**
     * Creates an instance of a MeshTransform.
     * @param {IMeshTransform} parameters
     */
    constructor(parameters: IMeshTransform = {}) {

        super(parameters);

        this.endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiMeshTransforms}`;

        const {
            width,
            height,
            depth,

            gradientThreshold,
            attenuationFactor,
            attenuationDecay,
            unsharpGaussianLow,
            unsharpGaussianHigh,
            unsharpHighFrequencyScale,
            p1,
            p2,
            p3,
            p4,
            p5,
            p6,
            p7,
            p8,

            // Navigation Properties
            projectId,
            project,
        } = parameters;

        this.width  = width;
        this.height = height;
        this.depth  = depth;

        this.gradientThreshold         = gradientThreshold;
        this.attenuationFactor         = attenuationFactor;
        this.attenuationDecay          = attenuationDecay;
        this.unsharpGaussianLow        = unsharpGaussianLow;
        this.unsharpGaussianHigh       = unsharpGaussianHigh;
        this.unsharpHighFrequencyScale = unsharpHighFrequencyScale;
        this.p1                        = p1;
        this.p2                        = p2;
        this.p3                        = p3;
        this.p4                        = p4;
        this.p5                        = p5;
        this.p6                        = p6;
        this.p7                        = p7;
        this.p8                        = p8;

        // Navigation Properties
        this.projectId              = projectId;
        this.project                = project;
        }

    /**
     * @description Constructs an instance of a MeshTransform.
     * @param {IModel} parameters : Dto.MeshTransform
     * @returns {MeshTransform}
     */
    public factory(parameters: IModel): MeshTransform {
        return new MeshTransform(parameters);
    }
}

/**
 *  Concrete implementation of IModel3d.
 *  @interface
 */
export class Model3d extends FileModel<Model3d> implements IModel3d {

    public format: Model3dFormat;

    // Navigation Properties
    public projectId: number;
    public project: IProject;

    public cameraId: number;
    public camera: ICamera;

    /**
     * Creates an instance of a Model3d.
     * @param {IModel3d} parameters
     */
    constructor(parameters: IModel3d = {}) {

        super(parameters);

        this.endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiModels}`;

        const {
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
    public factory(parameters: IModel): Model3d {
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
    constructor(parameters: IProject = {}) {

        super(parameters);

        this.endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiProjects}`;
    }

    /**
     * @description Constructs an instance of a Project.
     * @param {IModel} parameters : Dto.Project
     * @returns {Project}
     */
    public factory(parameters: IModel): Project {
        return new Project(parameters);
    }
}
