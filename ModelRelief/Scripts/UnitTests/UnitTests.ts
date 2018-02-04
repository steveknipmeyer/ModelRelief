// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE from 'three'
import * as Dto from 'DtoModels'

import {assert}   from 'chai'
import {Camera} from 'Camera'
import {DepthBuffer} from 'DepthBuffer'
import {Exception} from 'Exception';
import {MathLibrary} from 'Math'
import {HttpLibrary, ContentType, MethodType} from 'Http'
import {DepthBufferFormat} from 'Api/V1/Interfaces/IDepthBuffer';
import {HemisphereLight} from 'three';

/**
 * @description Unit test harness.
 * @export
 * @class UnitTests
 */
export class UnitTests {
   
    static DefaultVectorTolerance : number = 0.001;

    /**
     * Default constructor
     * @class UnitTests
     * @constructor
     */
    constructor() {       
    }

    static vectorsEqualWithinTolerance(v1 : THREE.Vector3, v2: THREE.Vector3, tolerance = UnitTests.DefaultVectorTolerance) {

        let formatTag = 'TAG';
        let errorMessage = `The ${formatTag} values of the vectors are not equal within ${tolerance}`
        assert.closeTo(v1.x, v2.x, tolerance, errorMessage.replace(formatTag, 'X'));
        assert.closeTo(v1.y, v2.y, tolerance, errorMessage.replace(formatTag, 'Y'));
        assert.closeTo(v1.z, v2.z, tolerance, errorMessage.replace(formatTag, 'Z'));
    }

    /**
     * @description Tests whether a Perspective camera can be re-constructed from the DTO Camera properties.
     * @static
     */
    static cameraRoundTrip(){

        let camera = new THREE.PerspectiveCamera(Camera.DefaultFieldOfView, 1.0, Camera.DefaultNearClippingPlane, Camera.DefaultFarClippingPlane);
        // https://stackoverflow.com/questions/15696963/three-js-set-and-read-camera-look-vector/15697227#15697227
        let worldVector:THREE.Vector3 = camera.getWorldDirection();

        let lookAt = new THREE.Vector3(100, 200, 300);
        let lookAtNormalized = lookAt.normalize();

        camera.lookAt(lookAt);
        worldVector = camera.getWorldDirection();

        this.vectorsEqualWithinTolerance(lookAtNormalized, worldVector);
    }

    /**
     * @description Round trip an array of bytes.
     * @static
     */
    static async binaryRoundTrip() {

        // Arrange
        let originalByteArray = new Uint8Array(256);
        for (let iByte = 0; iByte < 256; iByte++) {
            originalByteArray[iByte] = iByte;
        }

        let depthBuffer = new Dto.DepthBuffer({
            name : "DepthBuffer",
            description: "Unit Test",
            format: DepthBufferFormat.RAW,
            width: 16,
            height: 16
        });
        let depthBufferModel = await depthBuffer.postFileAsync(originalByteArray);

        // Act
        let readByteArray = await depthBufferModel.getFileAsync();

        // Assert
        assert.deepEqual(originalByteArray, readByteArray, "Byte arrays are different.")        
    }   

    static vertexMapping (depthBuffer : DepthBuffer, mesh : THREE.Mesh) {

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

