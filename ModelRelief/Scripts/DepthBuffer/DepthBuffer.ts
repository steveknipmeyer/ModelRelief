// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {assert}             from 'chai'
import * as THREE           from 'three'

import {Camera}             from 'Camera'
import {Graphics}           from 'Graphics'
import {ILogger, HTMLLogger} from 'Logger'
import {MathLibrary}        from 'Math'
import {Services}           from 'Services'
import {StopWatch}          from 'StopWatch'

export enum DepthBufferFormat {

    None,       // unknown   
    Raw,        // floating point array
    PNG,        // PNG format
    JPG         // JPG format
}

/**
 *  DepthBuffer 
 *  @class
 */
export class DepthBuffer {

    static readonly NormalizedTolerance   : number = .001;    
    
    _logger : ILogger;

    _rgbaArray : Uint8Array;
    depths     : Float32Array;
    width      : number;
    height     : number;

    camera           : THREE.PerspectiveCamera;
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
     * @param nearClipPlane Camera near clipping plane.
     * @param farClipPlane Camera far clipping plane.
     */
    constructor(rgbaArray : Uint8Array, width : number, height :number, camera : THREE.PerspectiveCamera) {
        
        this._rgbaArray = rgbaArray;

        this.width  = width;
        this.height = height;
        this.camera = camera;

        this.initialize();
    }

    //#region Properties
    /**
     * Returns the aspect ration of the depth buffer.
     */
    get aspectRatio () : number {

        return this.width / this.height;
    }

    /**
     * Returns the minimum normalized depth value.
     */
    get minimumNormalized () : number{

        return this._minimumNormalized;
    }

    /**
     * Returns the minimum depth value.
     */
    get minimum() : number{

        let minimum = this.normalizedToModelDepth(this._maximumNormalized);

        return minimum;
    }

    /**
     * Returns the maximum normalized depth value.
     */
    get maximumNormalized () : number{

        return this._maximumNormalized;
    }

    /**
     * Returns the maximum depth value.
     */
    get maximum() : number{

        let maximum = this.normalizedToModelDepth(this.minimumNormalized);

        return maximum;
    }

    /**
     * Returns the normalized depth range of the buffer.
     */
    get rangeNormalized() : number{

        let depthNormalized : number = this._maximumNormalized - this._minimumNormalized;

        return depthNormalized;
    }

    /**
     * Returns the normalized depth of the buffer.
     */
    get range() : number{

        let depth : number = this.maximum - this.minimum;

        return depth;
    }
    //#endregion

    /**
     * Calculate the extents of the depth buffer.
     */       
    calculateExtents () {

        this.setMinimumNormalized();        
        this.setMaximumNormalized();        
    }

    /**
     * Initialize
     */       
    initialize () {
        
        this._logger = Services.defaultLogger;       

        this._nearClipPlane   = this.camera.near;
        this._farClipPlane    = this.camera.far;
        this._cameraClipRange = this._farClipPlane - this._nearClipPlane;

        // RGBA -> Float32
        this.depths = new Float32Array(this._rgbaArray.buffer);
        
        // calculate extrema of depth buffer values
        this.calculateExtents();
    }

    /**
     * Convert a normalized depth [0,1] to depth in model units.
     * @param normalizedDepth Normalized depth [0,1].
     */
    normalizedToModelDepth(normalizedDepth : number) : number {

        // https://stackoverflow.com/questions/6652253/getting-the-true-z-value-from-the-depth-buffer
        normalizedDepth = 2.0 * normalizedDepth - 1.0;
        let zLinear = 2.0 * this.camera.near * this.camera.far / (this.camera.far + this.camera.near - normalizedDepth * (this.camera.far - this.camera.near));

        // zLinear is the distance from the camera; reverse to yield height from mesh plane
        zLinear = -(zLinear - this.camera.far);

        return zLinear;
    }

    /**
     * Returns the normalized depth value at a pixel index
     * @param row Buffer row.
     * @param column Buffer column.
     */
    depthNormalized (row : number, column) : number {

        let index = (Math.round(row) * this.width) + Math.round(column);
        return this.depths[index]
    }

    /**
     * Returns the depth value at a pixel index.
     * @param row Map row.
     * @param pixelColumn Map column.
     */
    depth(row : number, column) : number {

        let depthNormalized = this.depthNormalized(row, column);
        let depth = this.normalizedToModelDepth(depthNormalized);
        
        return depth;
    }

    /**
     * Calculates the minimum normalized depth value.
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
     * Calculates the maximum normalized depth value.
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
     * Returns the linear index of a model point in world coordinates.
     * @param worldVertex Vertex of model.
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
     * Returns the linear index of a model point in world coordinates.
     * @param worldVertex Vertex of model.
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
     * Analyzes properties of a depth buffer.
     */
    analyze () {
        this._logger.clearLog();

        let middle = this.width / 2;
        let decimalPlaces = 5;
        let headerStyle   = "font-family : monospace; font-weight : bold; color : blue; font-size : 18px";
        let messageStyle  = "font-family : monospace; color : black; font-size : 14px";

        this._logger.addMessage('Camera Properties', headerStyle);
        this._logger.addMessage(`Near Plane = ${this.camera.near}`, messageStyle);
        this._logger.addMessage(`Far Plane  = ${this.camera.far}`, messageStyle);
        this._logger.addMessage(`Clip Range = ${this.camera.far - this.camera.near}`, messageStyle);
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