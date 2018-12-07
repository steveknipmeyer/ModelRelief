// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto from "Scripts/Api/V1//Models/DtoModels";
import * as THREE from "three";

import {assert} from "chai";
import {DepthBufferFormat} from "Scripts/Api/V1/Interfaces/IDepthBuffer";
import {IGeneratedFileModel} from "Scripts/Api/V1/Interfaces/IGeneratedFileModel";
import {GeneratedFileModel} from "Scripts/Api/V1/Models/GeneratedFileModel";
import {BaseCamera} from "Scripts/Models/Camera/BaseCamera";
import {CameraFactory} from "Scripts/Models/Camera/CameraFactory";
import {Model3d} from "Scripts/Models/Model3d/Model3d";
import {Project} from "Scripts/Models/Project/Project";

/**
 * @description Represents a depth buffer.
 * @export
 * @class DepthBuffer
 * @extends {GeneratedFileModel}
 */
export class DepthBuffer extends GeneratedFileModel {

    /**
     * @description Returns the raw RGB array of the buffer.
     * @type {Uint8Array}
     */
    get rgbArray(): Uint8Array {

        return this._rgbaArray;
    }

    /**
     * @description Sets the raw RGB array.
     */
    set rgbArray(value: Uint8Array) {

        this._rgbaArray = value;

        // RGBA -> Float32
        this.depths = new Float32Array(this.rgbArray.buffer);
    }

    /**
     * @description Returns the raw floats of the depth buffer.
     * @type {Float32Array}
     */
    get depths(): Float32Array {

        return this._depths;
    }

    /**
     * @description Sets the raw floats of the depth buffer.
     */
    set depths(value: Float32Array) {

        this._depths = value;
    }

    /**
     * @description Returns the associated camera.
     * @readonly
     * @type {Camera}
     */
    get camera(): BaseCamera {

        return this._camera;
    }

    /**
     * @description Sets the associated camera.
     */
    set camera(value: BaseCamera) {

        this._camera = value;
    }

    /**
     * @description Returns the aspect ratio of the depth buffer.
     * @readonly
     * @type {number}
     */
    get aspectRatio(): number {

        return this.width / this.height;
    }

    /**
     * @description Returns the minimum normalized depth value.
     * @readonly
     * @type {number}
     */
    get minimumNormalized(): number {

        let minimumNormalized: number = Number.MAX_VALUE;
        for (let index: number = 0; index < this.depths.length; index++) {
            const depthValue: number = this.depths[index];

            if (depthValue < minimumNormalized)
                minimumNormalized = depthValue;
            }

        return minimumNormalized;
    }

    /**
     * @description Returns the minimum depth value.
     * @readonly
     * @type {number}
     */
    get minimum(): number {

        const minimum = this.normalizedToModelDepth(this.maximumNormalized);

        return minimum;
    }

    /**
     * @description Returns the maximum normalized depth value.
     * @readonly
     * @type {number}
     */
    get maximumNormalized(): number {

        let maximumNormalized: number = Number.MIN_VALUE;
        for (let index: number = 0; index < this.depths.length; index++) {
            const depthValue: number = this.depths[index];
            if (depthValue > maximumNormalized)
                maximumNormalized = depthValue;
            }
        return maximumNormalized;
    }

    /**
     * @description Returns the maximum depth value.
     * @readonly
     * @type {number}
     */
    get maximum(): number {

        const maximum = this.normalizedToModelDepth(this.minimumNormalized);

        return maximum;
    }

    /**
     * @description Returns the normalized depth range of the buffer.
     * @readonly
     * @type {number}
     */
    get rangeNormalized(): number {

        const depthNormalized: number = this.maximumNormalized - this.minimumNormalized;

        return depthNormalized;
    }

    /**
     * @description Returns the normalized depth of the buffer.
     * @readonly
     * @type {number}
     */
    get range(): number {

        const depth: number = this.maximum - this.minimum;

        return depth;
    }

    /**
     * @description Returns a DepthBuffer instance through an HTTP query of the Id.
     * @static
     * @param {number} id DepthBuffer Id.
     * @returns {Promise<DepthBuffer>}
     */
    public static async fromIdAsync(id: number ): Promise<DepthBuffer> {

        if (!id)
            return undefined;

        const depthBuffer = new Dto.DepthBuffer ({
            id,
        });
        const depthBufferModel = await depthBuffer.getAsync();
        return DepthBuffer.fromDtoModelAsync(depthBufferModel);
    }

    /**
     * @description Constructs an instance from a DTO model.
     * @returns {DepthBuffer}
     */
    public static async fromDtoModelAsync(dtoDepthBuffer: Dto.DepthBuffer): Promise<DepthBuffer> {

        // constructor
        const depthBuffer = new DepthBuffer({
            id          : dtoDepthBuffer.id,
            name        : dtoDepthBuffer.name,
            description : dtoDepthBuffer.description,
        });

        depthBuffer.fileTimeStamp      = dtoDepthBuffer.fileTimeStamp;
        depthBuffer.fileIsSynchronized = dtoDepthBuffer.fileIsSynchronized;

        depthBuffer.width  = dtoDepthBuffer.width;
        depthBuffer.height = dtoDepthBuffer.height;
        depthBuffer.format = dtoDepthBuffer.format;

        depthBuffer.project = await Project.fromIdAsync(dtoDepthBuffer.projectId);
        depthBuffer.model3d = await Model3d.fromIdAsync(dtoDepthBuffer.model3dId);
        depthBuffer.camera  = await CameraFactory.constructFromIdAsync(dtoDepthBuffer.cameraId);

        return depthBuffer;
    }

    public width: number;
    public height: number;
    public format: DepthBufferFormat;

    // Navigation Properties
    public project: Project;
    public model3d: Model3d;
    public _camera: BaseCamera;

    // Private
    private _rgbaArray: Uint8Array;
    private _depths: Float32Array;

    /**
     * Creates an instance of DepthBuffer.
     * @param {IGeneratedFileModel} [parameters={}] GeneratedFileModel properties.
     */
    constructor(parameters: IGeneratedFileModel = {}) {

        parameters.name        = parameters.name        || "DepthBuffer";
        parameters.description = parameters.description || "DepthBuffer";

        super(parameters);

        this.initialize();
    }

    /**
     * @description Perform setup and initialization.
     */
    public initialize(): void {
    }

    /**
     * @description Returns a DTO DepthBuffer from the instance.
     * @returns {Dto.DepthBuffer}
     */
    public toDtoModel(): Dto.DepthBuffer {

        const model = new Dto.DepthBuffer({
            id              : this.id,
            name            : this.name,
            description     : this.description,

            width           : this.width,
            height          : this.height,
            format          : this.format,

            projectId       : this.project ? this.project.id : undefined,
            model3dId       : this.model3d ? this.model3d.id : undefined,
            cameraId        : this.camera  ? this.camera.id : undefined,

            fileTimeStamp      : this.fileTimeStamp,
            fileIsSynchronized : this.fileIsSynchronized,
        });

        return model;
    }

    /**
     * @description Convert a normalized depth [0,1] to depth in model units.
     * @param {number} normalizedDepth Normalized linear depth [0,1].
     * @returns {number}
     */
    public normalizedToModelDepth(normalizedDepth: number): number {

        // N.B.Depth values are linear(as written by THREE.WebGLRenderTarget to the THREE.DepthBuffer depth texture).
        const modelDepth = (this.camera.viewCamera.far - this.camera.viewCamera.near) * (1.0 - normalizedDepth);

        return modelDepth;
    }

    /**
     * @description Convert a normalized non-linear depth [0,1] to depth in model units.
     * @param {number} normalizedNonLinearDepth Normalized non-linear depth [0,1].
     * @returns {number}
     */
    public normalizedNonLinearToModelDepth(normalizedNonLinearDepth: number): number {

        // https://stackoverflow.com/questions/6652253/getting-the-true-z-value-from-the-depth-buffer
        normalizedNonLinearDepth = (2.0 * normalizedNonLinearDepth) - 1.0;
        let modelDepth = 2.0 * this.camera.viewCamera.near * this.camera.viewCamera.far / (this.camera.viewCamera.far + this.camera.viewCamera.near - normalizedNonLinearDepth * (this.camera.viewCamera.far - this.camera.viewCamera.near));

        // zLinear is the distance from the camera; adjust to yield height from mesh plane
        modelDepth = this.camera.viewCamera.far - modelDepth;

        return modelDepth;
    }

    /**
     * @description Returns the normalized depth value at a pixel index
     * @param {number} row Buffer row.
     * @param {any} column Buffer column.
     * @returns {number}
     */
    public depthNormalized(row: number, column): number {

        const index = (Math.round(row) * this.width) + Math.round(column);
        return this.depths[index];
    }

    /**
     * @description Returns the depth value at a pixel index.
     * @param {number} row Buffer row.
     * @param {any} column Buffer column.
     * @returns {number}
     */
    public depth(row: number, column): number {

        const depthNormalized = this.depthNormalized(row, column);
        const depth = this.normalizedToModelDepth(depthNormalized);

        return depth;
    }

    /**
     * @description Returns the buffer indices of a model point in world coordinates.
     * @param {THREE.Vector3} worldVertex Vertex of model.
     * @param {THREE.Box3} planeBoundingBox Size of planar bounding box.
     * @returns {THREE.Vector2}
     */
    public getModelVertexIndices(worldVertex: THREE.Vector3, planeBoundingBox: THREE.Box3): THREE.Vector2 {

        const boxSize: THREE.Vector3 = planeBoundingBox.getSize(new THREE.Vector3());
        const meshExtents: THREE.Vector2 = new THREE.Vector2 (boxSize.x, boxSize.y);

        //  map coordinates to offsets in range [0, 1]
        const offsetX: number = (worldVertex.x + (boxSize.x / 2)) / boxSize.x;
        const offsetY: number = (worldVertex.y + (boxSize.y / 2)) / boxSize.y;

        let row: number = offsetY * (this.height - 1);
        let column: number = offsetX * (this.width - 1);
        row    = Math.round(row);
        column = Math.round(column);

        assert.isTrue((row >= 0) && (row < this.height), (`Vertex (${worldVertex.x}, ${worldVertex.y}, ${worldVertex.z}) yielded row = ${row}`));
        assert.isTrue((column >= 0) && (column < this.width), (`Vertex (${worldVertex.x}, ${worldVertex.y}, ${worldVertex.z}) yielded column = ${column}`));

        return new THREE.Vector2(row, column);
    }

    /**
     * @description Returns the linear index of a model point in world coordinates.
     * @param {THREE.Vector3} worldVertex Vertex of model.
     * @param {THREE.Box3} planeBoundingBox Size of planar bounding box.
     * @returns {number}
     */
    public getModelVertexIndex(worldVertex: THREE.Vector3, planeBoundingBox: THREE.Box3): number {

        const indices: THREE.Vector2 = this.getModelVertexIndices(worldVertex, planeBoundingBox);
        const row: number = indices.x;
        const column: number = indices.y;

        let index = (row * this.width) + column;
        index = Math.round(index);

        assert.isTrue((index >= 0) && (index < this.depths.length), (`Vertex (${worldVertex.x}, ${worldVertex.y}, ${worldVertex.z}) yielded index = ${index}`));

        return index;
    }

    /**
     * @description Analyzes properties of a depth buffer.
     */
    public analyze() {
        // this._logger.clearLog();

        const middle = this.width / 2;
        const decimalPlaces = 5;
        const headerStyle   = "font-family : monospace; font-weight : bold; color : yellow; font-size : 18px";
        const messageStyle  = "font-family : monospace; color : white; font-size : 14px";

        this._logger.addMessage("Camera Properties", headerStyle);
        this._logger.addMessage(`Near Plane = ${this.camera.viewCamera.near}`, messageStyle);
        this._logger.addMessage(`Far Plane  = ${this.camera.viewCamera.far}`, messageStyle);
        this._logger.addMessage(`Clip Range = ${this.camera.viewCamera.far - this.camera.viewCamera.near}`, messageStyle);
        this._logger.addEmptyLine();

        this._logger.addMessage("Normalized", headerStyle);
        this._logger.addMessage(`Lower Left Depth  = ${this.depthNormalized(0, 0).toFixed(decimalPlaces)}`, messageStyle);
        this._logger.addMessage(`Upper Right Depth = ${this.depthNormalized(this.width - 1, this.height - 1).toFixed(decimalPlaces)}`, messageStyle);
        this._logger.addMessage(`Center Depth      = ${this.depthNormalized(middle, middle).toFixed(decimalPlaces)}`, messageStyle);
        this._logger.addMessage(`Z Range = ${this.rangeNormalized.toFixed(decimalPlaces)}`, messageStyle);
        this._logger.addMessage(`Minimum = ${this.minimumNormalized.toFixed(decimalPlaces)}`, messageStyle);
        this._logger.addMessage(`Maximum = ${this.maximumNormalized.toFixed(decimalPlaces)}`, messageStyle);
        this._logger.addEmptyLine();

        this._logger.addMessage("Model Units", headerStyle);
        this._logger.addMessage(`Lower Left Depth = ${this.depth(0, 0).toFixed(decimalPlaces)}`, messageStyle);
        this._logger.addMessage(`Upper Right Depth = ${this.depth(this.width - 1, this.height - 1).toFixed(decimalPlaces)}`, messageStyle);
        this._logger.addMessage(`Center Depth = ${this.depth(middle, middle).toFixed(decimalPlaces)}`, messageStyle);
        this._logger.addMessage(`Z Range = ${this.range.toFixed(decimalPlaces)}`, messageStyle);
        this._logger.addMessage(`Minimum = ${this.minimum.toFixed(decimalPlaces)}`, messageStyle);
        this._logger.addMessage(`Maximum = ${this.maximum.toFixed(decimalPlaces)}`, messageStyle);
        this._logger.addEmptyLine();
    }
}
