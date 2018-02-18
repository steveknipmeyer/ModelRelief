// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto                 from 'DtoModels'
import * as THREE               from 'three'

import {Camera}                 from 'Camera'
import {assert}                 from 'chai'
import {GeneratedFileModel}     from 'GeneratedFileModel'
import {Graphics}               from 'Graphics'
import {DepthBufferFormat}      from 'IDepthBuffer';
import {ILogger, HTMLLogger}    from 'Logger'
import {MathLibrary}            from 'Math'
import {Model3d}                from 'Model3d'
import {Project}                from 'Project'
import {Services}               from 'Services'
import {StopWatch}              from 'StopWatch'

/**
 * @description Represents a depth buffer.
 * @export
 * @class DepthBuffer
 */
export class DepthBuffer extends GeneratedFileModel<DepthBuffer> {

    static readonly NormalizedTolerance   : number = .001;    

    depths     : Float32Array;
    width      : number;
    height     : number;
    format     : DepthBufferFormat;

    // Navigation Properties    
    projectId  : number;
    project    : Project;

    model3dId  : number;
    model      : Model3d; 

    cameraId   : number;
    camera     : Camera;


    // Private
    _logger          : ILogger;
    _rgbaArray       : Uint8Array;

    _nearClipPlane   : number;
    _farClipPlane    : number;
    _cameraClipRange : number;
    
    _minimumNormalized : number;
    _maximumNormalized : number;

    /**
     * @constructor
     * @param rgbaArray Raw aray of RGBA bytes packed with floats.
     * @param width Width of map.
     * @param height Height of map.
     * @param camera Perspective camera.
     */
    constructor(rgbaArray : Uint8Array, width : number, height : number, camera : Camera) {

        super({
            name: 'DepthBuffer', 
            description: 'DepthBuffer',
        });
        
        this._rgbaArray = rgbaArray;

        this.width  = width;
        this.height = height;      
        this.camera = camera;

        this.initialize();
    }

    /**
     * @description Constructs an instance from a DTO model.
     * @returns {DepthBuffer} 
     */
    static fromDtoModel(dtoDepthBuffer : Dto.DepthBuffer) : DepthBuffer {

        let rgbArray : Uint8Array = new Uint8Array(0);                                  // N.B. != Dto.DepthBuffer
        let camera : Camera       = new Camera(new THREE.PerspectiveCamera());          // N.B. != Dto.DepthBuffer

        let width  = dtoDepthBuffer.width;
        let height = dtoDepthBuffer.height;

        // constructor
        let depthBuffer = new DepthBuffer (rgbArray, width, height, camera);

        depthBuffer.id          = dtoDepthBuffer.id;
        depthBuffer.name        = dtoDepthBuffer.name;
        depthBuffer.description = dtoDepthBuffer.description;       

        depthBuffer.projectId   = dtoDepthBuffer.projectId;
        depthBuffer.model3dId   = dtoDepthBuffer.model3dId;
        depthBuffer.cameraId    = dtoDepthBuffer.cameraId;

        return depthBuffer;
    }

    /**
     * @description Returns a DTO DepthBuffer from the instance.
     * @returns {Dto.DepthBuffer} 
     */
    toDtoModel() : Dto.DepthBuffer {

        let model = new Dto.DepthBuffer({
            id              : this.id,
            name            : this.name,
            description     : this.description,    

            width           : this.width,
            height          : this.height,
            format          : this.format,
        
            projectId       : this.projectId,
            model3dId       : this.model3dId,
            cameraId        : this.cameraId,
        });

        return model;
    }        

    //#region Properties

    /**
     * @description Returns the aspect ratio of the depth buffer.
     * @readonly
     * @type {number}
     */
    get aspectRatio () : number {

        return this.width / this.height;
    }

    /**
     * @description Returns the minimum normalized depth value.
     * @readonly
     * @type {number}
     */
    get minimumNormalized () : number{

        return this._minimumNormalized;
    }

    /**
     * @description Returns the minimum depth value.
     * @readonly
     * @type {number}
     */
    get minimum() : number{

        let minimum = this.normalizedToModelDepth(this._maximumNormalized);

        return minimum;
    }

    /**
     * @description Returns the maximum normalized depth value.
     * @readonly
     * @type {number}
     */
    get maximumNormalized () : number{

        return this._maximumNormalized;
    }

    /**
     * @description Returns the maximum depth value.
     * @readonly
     * @type {number}
     */
    get maximum() : number{

        let maximum = this.normalizedToModelDepth(this.minimumNormalized);

        return maximum;
    }

    /**
     * @description Returns the normalized depth range of the buffer.
     * @readonly
     * @type {number}
     */
    get rangeNormalized() : number{

        let depthNormalized : number = this._maximumNormalized - this._minimumNormalized;

        return depthNormalized;
    }

    /**
     * @description Returns the normalized depth of the buffer.
     * @readonly
     * @type {number}
     */
    get range() : number{

        let depth : number = this.maximum - this.minimum;

        return depth;
    }
    //#endregion

    /**
     * @description Calculate the extents of the depth buffer.
     */
    calculateExtents () {

        this.setMinimumNormalized();        
        this.setMaximumNormalized();        
    }

    /**
     * @description Initialize
     */
    initialize () {
        
        this._logger = Services.defaultLogger;       

        this._nearClipPlane   = this.camera.viewCamera.near;
        this._farClipPlane    = this.camera.viewCamera.far;
        this._cameraClipRange = this._farClipPlane - this._nearClipPlane;

        // RGBA -> Float32
        this.depths = new Float32Array(this._rgbaArray.buffer);
        
        // calculate extrema of depth buffer values
        this.calculateExtents();
    }

    /**
     * @description Convert a normalized depth [0,1] to depth in model units.
     * @param {number} normalizedDepth Normalized depth [0,1].
     * @returns {number} 
     */
    normalizedToModelDepth(normalizedDepth : number) : number {

        // https://stackoverflow.com/questions/6652253/getting-the-true-z-value-from-the-depth-buffer
        normalizedDepth = 2.0 * normalizedDepth - 1.0;
        let zLinear = 2.0 * this.camera.viewCamera.near * this.camera.viewCamera.far / (this.camera.viewCamera.far + this.camera.viewCamera.near - normalizedDepth * (this.camera.viewCamera.far - this.camera.viewCamera.near));

        // zLinear is the distance from the camera; reverse to yield height from mesh plane
        zLinear = -(zLinear - this.camera.viewCamera.far);

        return zLinear;
    }

    /**
     * @description Returns the normalized depth value at a pixel index
     * @param {number} row Buffer row.
     * @param {any} column Buffer column.
     * @returns {number} 
     */
    depthNormalized (row : number, column) : number {

        let index = (Math.round(row) * this.width) + Math.round(column);
        return this.depths[index]
    }

    /**
     * @description Returns the depth value at a pixel index.
     * @param {number} row Buffer row.
     * @param {any} column Buffer column. 
     * @returns {number} 
     */
    depth(row : number, column) : number {

        let depthNormalized = this.depthNormalized(row, column);
        let depth = this.normalizedToModelDepth(depthNormalized);
        
        return depth;
    }

    /**
     * @description Calculates the minimum normalized depth value.
     */
    setMinimumNormalized() {

        let minimumNormalized : number = Number.MAX_VALUE;
        for (let index: number = 0; index < this.depths.length; index++)
            {
            let depthValue : number = this.depths[index];

            if (depthValue < minimumNormalized)
                minimumNormalized = depthValue;
            }

        this._minimumNormalized = minimumNormalized;
    }

    /**
     * @description Calculates the maximum normalized depth value.
     */
    setMaximumNormalized() {

        let maximumNormalized : number = Number.MIN_VALUE;
        for (let index: number = 0; index < this.depths.length; index++)
            {
            let depthValue : number = this.depths[index];
            if (depthValue > maximumNormalized)
                maximumNormalized = depthValue;
            }

        this._maximumNormalized = maximumNormalized;
    }

    /**
     * @description Returns the buffer indices of a model point in world coordinates.
     * @param {THREE.Vector3} worldVertex Vertex of model.
     * @param {THREE.Box3} planeBoundingBox Size of planar bounding box.
     * @returns {THREE.Vector2} 
     */
    getModelVertexIndices (worldVertex : THREE.Vector3, planeBoundingBox : THREE.Box3) : THREE.Vector2 {
    
        let boxSize      : THREE.Vector3 = planeBoundingBox.getSize();
        let meshExtents  : THREE.Vector2 = new THREE.Vector2 (boxSize.x, boxSize.y);

        //  map coordinates to offsets in range [0, 1]
        let offsetX : number = (worldVertex.x + (boxSize.x / 2)) / boxSize.x;
        let offsetY : number = (worldVertex.y + (boxSize.y / 2)) / boxSize.y;

        let row    : number = offsetY * (this.height - 1);
        let column : number = offsetX * (this.width - 1);
        row    = Math.round(row);
        column = Math.round(column);

        assert.isTrue((row >= 0) && (row < this.height), (`Vertex (${worldVertex.x}, ${worldVertex.y}, ${worldVertex.z}) yielded row = ${row}`));
        assert.isTrue((column>= 0) && (column < this.width), (`Vertex (${worldVertex.x}, ${worldVertex.y}, ${worldVertex.z}) yielded column = ${column}`));

        return new THREE.Vector2(row, column);
    }

    /**
     * @description Returns the linear index of a model point in world coordinates.
     * @param {THREE.Vector3} worldVertex Vertex of model.
     * @param {THREE.Box3} planeBoundingBox Size of planar bounding box.
     * @returns {number} 
     */
    getModelVertexIndex (worldVertex : THREE.Vector3, planeBoundingBox : THREE.Box3) : number {

        let indices : THREE.Vector2 = this.getModelVertexIndices(worldVertex, planeBoundingBox);    
        let row    : number = indices.x;
        let column : number = indices.y;
        
        let index = (row * this.width) + column;
        index = Math.round(index);

        assert.isTrue((index >= 0) && (index < this.depths.length), (`Vertex (${worldVertex.x}, ${worldVertex.y}, ${worldVertex.z}) yielded index = ${index}`));

        return index;
    }

    /**
     * @description Analyzes properties of a depth buffer.
     */
    analyze () {
        this._logger.clearLog();

        let middle = this.width / 2;
        let decimalPlaces = 5;
        let headerStyle   = "font-family : monospace; font-weight : bold; color : blue; font-size : 18px";
        let messageStyle  = "font-family : monospace; color : black; font-size : 14px";

        this._logger.addMessage('Camera Properties', headerStyle);
        this._logger.addMessage(`Near Plane = ${this.camera.viewCamera.near}`, messageStyle);
        this._logger.addMessage(`Far Plane  = ${this.camera.viewCamera.far}`, messageStyle);
        this._logger.addMessage(`Clip Range = ${this.camera.viewCamera.far - this.camera.viewCamera.near}`, messageStyle);
        this._logger.addEmptyLine();

        this._logger.addMessage('Normalized', headerStyle);
        this._logger.addMessage(`Center Depth = ${this.depthNormalized(middle, middle).toFixed(decimalPlaces)}`, messageStyle);
        this._logger.addMessage(`Z Range = ${this.rangeNormalized.toFixed(decimalPlaces)}`, messageStyle);
        this._logger.addMessage(`Minimum = ${this.minimumNormalized.toFixed(decimalPlaces)}`, messageStyle);
        this._logger.addMessage(`Maximum = ${this.maximumNormalized.toFixed(decimalPlaces)}`, messageStyle);
        this._logger.addEmptyLine();

        this._logger.addMessage('Model Units', headerStyle);
        this._logger.addMessage(`Center Depth = ${this.depth(middle, middle).toFixed(decimalPlaces)}`, messageStyle);
        this._logger.addMessage(`Z Range = ${this.range.toFixed(decimalPlaces)}`, messageStyle);
        this._logger.addMessage(`Minimum = ${this.minimum.toFixed(decimalPlaces)}`, messageStyle);
        this._logger.addMessage(`Maximum = ${this.maximum.toFixed(decimalPlaces)}`, messageStyle);
    }
}