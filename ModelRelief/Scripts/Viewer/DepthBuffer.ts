// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import {assert}             from 'chai'
import * as THREE           from 'three'

import {Graphics}           from 'Graphics'
import {Logger, HTMLLogger} from 'Logger'
import {MathLibrary}        from 'Math'
          
/**
 *  DepthBuffer 
 *  @class
 */
export class DepthBuffer {

    static normalizedTolerance : number = .001;    

    logger : Logger;

    rgbaArray : Uint8Array;
    depths    : Float32Array;
    width     : number;
    height    : number;

    camera          : THREE.PerspectiveCamera;
    nearClipPlane   : number;
    farClipPlane    : number;
    cameraClipRange : number;

    /**
     * @constructor
     * @param rgbaArray Raw aray of RGBA bytes packed with floats.
     * @param width Width of map.
     * @param height Height of map.
     * @param nearClipPlane Camera near clipping plane.
     * @param farClipPlane Camera far clipping plane.
     */
    constructor(rgbaArray : Uint8Array, width : number, height :number, camera : THREE.PerspectiveCamera) {
        
        this.rgbaArray = rgbaArray;

        this.width  = width;
        this.height = height;
        this.camera = camera;

        this.initialize();
    }

    /**
     * Initialize
     */       
    initialize () {
        
        this.logger = new HTMLLogger();       

        this.nearClipPlane = this.camera.near;
        this.farClipPlane  = this.camera.far;
        this.cameraClipRange = this.farClipPlane - this.nearClipPlane;

        // RGBA -> Float32
        this.depths = new Float32Array(this.rgbaArray.buffer);
    }

    /**
     * Convert a normalized depth [0,1] to depth in model units.
     * @param normalizedDepth Normalized depth [0,1].
     */
    normalizedToModelDepth(normalizedDepth : number) : number {

        return normalizedDepth * this.cameraClipRange;
    }

    /**
     * Returns the normalized depth value at a pixel index
     * @param row Buffer row.
     * @param column Buffer column.
     */
    depthNormalized (row : number, column) : number {

        let index = (row * this.width) + column;
        return this.depths[index]
    }

    /**
     * Returns the depth value at a pixel index
     * @param row Map row.
     * @param pixelColumn Map column.
     */
    depth(row : number, column) : number {

        let depthNormalized = this.depthNormalized(row, column);
        let depth = this.normalizedToModelDepth(depthNormalized);

        return depth;
    }

    /**
     * Returns the minimum normalized depth value.
     */
    get minimumNormalized() : number{

        let minimumNormalized : number = Number.MAX_VALUE;
        for (let index: number = 0; index < this.depths.length; index++)
            {
            let depthValue : number = this.depths[index];

            if (depthValue < minimumNormalized)
                minimumNormalized = depthValue;
            }
        return minimumNormalized;
    }

    /**
     * Returns the minimum depth value.
     */
    get minimum() : number{

        let minimum = this.normalizedToModelDepth(this.minimumNormalized);

        return minimum;
    }

    /**
     * Returns the maximum normalized depth value.
     */
    get maximumNormalized() : number{

        let maximumNormalized : number = Number.MIN_VALUE;
        for (let index: number = 0; index < this.depths.length; index++)
            {
            let depthValue : number = this.depths[index];

            // skip values at far plane
            if (MathLibrary.numbersEqualWithinTolerance(depthValue, 1.0, DepthBuffer.normalizedTolerance))
                continue;

            if (depthValue > maximumNormalized)
                maximumNormalized = depthValue;
            }
        return maximumNormalized;
    }

    /**
     * Returns the maximum depth value.
     */
    get maximum() : number{

        let maximum = this.normalizedToModelDepth(this.maximumNormalized);

        return maximum;
    }

    /**
     * Returns the normalized depth range of the buffer.
     */
    get rangeNormalized() : number{

        let depthNormalized : number = this.maximumNormalized - this.minimumNormalized;

        return depthNormalized;
    }

    /**
     * Returns the normalized depth of the buffer.
     */
    get range() : number{

        let depth : number = this.normalizedToModelDepth( this.rangeNormalized);

        return depth;
    }

    /**
     * Returns the linear index of a model point in world coordinates.
     * @param worldVertex Vertex of model.
     */
    getModelVertexIndex (worldVertex : THREE.Vertex, planeBoundingBox : THREE.Box3) : number {
    
        let boxSize      : THREE.Vector3 = planeBoundingBox.getSize();
        let meshExtents  : THREE.Vector2 = new THREE.Vector2 (boxSize.x, boxSize.y);

        //  map coordinates to offsets in range [0, 1]
        let offsetX : number = (worldVertex.x + (boxSize.x / 2)) / boxSize.x;
        let offsetY : number = (worldVertex.y + (boxSize.y / 2)) / boxSize.y;

        let row    : number = offsetY * (this.height - 1);
        let column : number = offsetX * (this.width - 1);
        
        let index = (row * this.width) + column;
        index = Math.floor(index);

        assert.isTrue((index >= 0) && (index < this.depths.length), (`Vertex (${worldVertex.x}, ${worldVertex.y}, ${worldVertex.z}) yielded offset = (${offsetX}, ${offsetY}), index = ${index}`));

        return index;
    }
}