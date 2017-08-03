// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE           from 'three'
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
    values    : Float32Array;
    width     : number;
    height    : number;

    nearClipPlane : number;
    farClipPlane  : number;
    cameraRange   : number;

    /**
     * @constructor
     * @param rgbaArray Raw aray of RGBA bytes packed with floats.
     * @param width Width of map.
     * @param height Height of map.
     * @param nearClipPlane Camera near clipping plane.
     * @param farClipPlane Camera far clipping plane.
     */
    constructor(rgbaArray : Uint8Array, width : number, height :number, nearClipPlane : number, farClipPlane : number) {
        
        this.rgbaArray = rgbaArray;

        this.width  = width;
        this.height = height;
        this.nearClipPlane = nearClipPlane;
        this.farClipPlane  = farClipPlane;

        this.initialize();
    }

    /**
     * Initialize
     */       
    initialize () {
        
        this.logger = new HTMLLogger();       

        this.values = new Float32Array(this.rgbaArray.buffer);
        this.cameraRange = this.farClipPlane - this.nearClipPlane;
    }

    /**
     * Returns the normalized depth value at a pixel index
     * @param pixelRow Map row.
     * @param pixelColumn Map column.
     */
    valueNormalized (pixelRow : number, pixelColumn) : number {

        let index = (pixelRow * this.width) + pixelColumn;
        return this.values[index]
    }

    /**
     * Returns the depth value at a pixel index
     * @param pixelRow Map row.
     * @param pixelColumn Map column.
     */
    value(pixelRow : number, pixelColumn) : number {

        let value = this.valueNormalized(pixelRow, pixelColumn) * this.cameraRange;

        return value;
    }

    /**
    * Returns the minimum normalized depth value.
    */
    get minimumNormalized() : number{

        let minimumNormalized : number = Number.MAX_VALUE;
        for (let index: number = 0; index < this.values.length; index++)
            {
            let depthValue : number = this.values[index];

            if (depthValue < minimumNormalized)
                minimumNormalized = depthValue;
            }
        return minimumNormalized;
    }

    /**
    * Returns the minimum depth value.
    */
    get minimum() : number{

        let minimum = this.minimumNormalized * this.cameraRange;

        return minimum;
    }

    /**
    * Returns the maximum normalized depth value.
    */
    get maximumNormalized() : number{

        let maximumNormalized : number = Number.MIN_VALUE;
        for (let index: number = 0; index < this.values.length; index++)
            {
            let depthValue : number = this.values[index];

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

        let maximum = this.maximumNormalized * this.cameraRange;

        return maximum;
    }

    /**
    * Returns the normalized depth of the buffer.
    */
    get depthNormalized() : number{

        let depthNormalized : number = this.maximumNormalized - this.minimumNormalized;

        return depthNormalized;
    }

    /**
    * Returns the normalized depth of the buffer.
    */
    get depth() : number{

        let depth : number = this.depthNormalized * this.cameraRange;

        return depth;
    }

}