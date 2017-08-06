// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import {assert}   from 'chai'
import * as THREE from 'three'

import {DepthBuffer} from 'DepthBuffer'
import {MathLibrary} from 'Math'
                                
/**
 * @exports Viewer/Viewer
 */
export class UnitTests {
   
    /**
     * Default constructor
     * @class UnitTests
     * @constructor
     */
    constructor() {       
    }
        
    static VertexMapping (depthBuffer : DepthBuffer, mesh : THREE.Mesh) {

        let meshGeometry : THREE.Geometry = <THREE.Geometry> mesh.geometry;
        meshGeometry.computeBoundingBox();
        let boundingBox = meshGeometry.boundingBox;

        // width  = 3              3   4   5
        // column = 2              0   1   2
        // buffer length = 6

        // Test Points            
        let lowerLeft  = boundingBox.min;
        let lowerRight = new THREE.Vector3 (boundingBox.max.x, boundingBox.min.y, 0);
        let upperRight = boundingBox.max;
        let upperLeft  = new THREE.Vector3 (boundingBox.min.x, boundingBox.max.y, 0);
        let center     = boundingBox.getCenter();

        // Expected Values
        let bufferLength    : number = (depthBuffer.width * depthBuffer.height);

        let firstColumn   : number = 0;
        let lastColumn    : number = depthBuffer.width - 1;
        let centerColumn  : number = Math.round(depthBuffer.width / 2);
        let firstRow      : number = 0;
        let lastRow       : number = depthBuffer.height - 1;
        let centerRow     : number = Math.round(depthBuffer.height / 2);

        let lowerLeftIndex  : number = 0;
        let lowerRightIndex : number = depthBuffer.width - 1;
        let upperRightIndex : number = bufferLength - 1;
        let upperLeftIndex  : number = bufferLength - depthBuffer.width;
        let centerIndex     : number = (centerRow * depthBuffer.width) +  Math.round(depthBuffer.width / 2);

        let lowerLeftIndices  : THREE.Vector2 = new THREE.Vector2(firstRow, firstColumn);
        let lowerRightIndices : THREE.Vector2 = new THREE.Vector2(firstRow, lastColumn);
        let upperRightIndices : THREE.Vector2 = new THREE.Vector2(lastRow, lastColumn);
        let upperLeftIndices  : THREE.Vector2 = new THREE.Vector2(lastRow, firstColumn);
        let centerIndices     : THREE.Vector2 = new THREE.Vector2(centerRow, centerColumn);
        
        let index   : number
        let indices : THREE.Vector2;

        // Lower Left
        indices = depthBuffer.getModelVertexIndices(lowerLeft, boundingBox);
        assert.deepEqual(indices, lowerLeftIndices);

        index   = depthBuffer.getModelVertexIndex(lowerLeft, boundingBox);
        assert.equal(index, lowerLeftIndex);

        // Lower Right
        indices = depthBuffer.getModelVertexIndices(lowerRight, boundingBox);
        assert.deepEqual(indices, lowerRightIndices);

        index = depthBuffer.getModelVertexIndex(lowerRight, boundingBox);
        assert.equal(index, lowerRightIndex);

        // Upper Right
        indices = depthBuffer.getModelVertexIndices(upperRight, boundingBox);
        assert.deepEqual(indices, upperRightIndices);

        index = depthBuffer.getModelVertexIndex(upperRight, boundingBox);
        assert.equal(index, upperRightIndex);

        // Upper Left
        indices = depthBuffer.getModelVertexIndices(upperLeft, boundingBox);
        assert.deepEqual(indices, upperLeftIndices);

        index = depthBuffer.getModelVertexIndex(upperLeft, boundingBox);
        assert.equal(index, upperLeftIndex);

        // Center
        indices = depthBuffer.getModelVertexIndices(center, boundingBox);
        assert.deepEqual(indices, centerIndices);

        index = depthBuffer.getModelVertexIndex(center, boundingBox);
        assert.equal(index, centerIndex);
    }

    } 

