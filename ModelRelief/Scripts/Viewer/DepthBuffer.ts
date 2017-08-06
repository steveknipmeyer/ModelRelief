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

    static readonly MeshModelName       : string = 'ModelMesh';
    static readonly normalizedTolerance : number = .001;    

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

        return normalizedDepth;
//      return normalizedDepth * this.cameraClipRange;
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
     * Returns the aspect ration of the depth buffer.
     */
        get aspectRatio () : number {

        return this.width / this.height;
    }

/**
     * Returns the linear index of a model point in world coordinates.
     * @param worldVertex Vertex of model.
     */
    getModelVertexIndices (worldVertex : THREE.Vertex, planeBoundingBox : THREE.Box3) : THREE.Vector2 {
    
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
    getModelVertexIndex (worldVertex : THREE.Vertex, planeBoundingBox : THREE.Box3) : number {

        let indices : THREE.Vector2 = this.getModelVertexIndices(worldVertex, planeBoundingBox);    
        let row    : number = indices.x;
        let column : number = indices.y;
        
        let index = (row * this.width) + column;
        index = Math.round(index);

        assert.isTrue((index >= 0) && (index < this.depths.length), (`Vertex (${worldVertex.x}, ${worldVertex.y}, ${worldVertex.z}) yielded index = ${index}`));

        return index;
    }
    /**
     * Transforms the vertices of a mesh plane to match the depth offsets of the DB.
     * @param meshPlane Mesh plane to transform.
     */
    transformMeshPlaneToMesh (meshPlane : THREE.Mesh) {

        let meshGeometry : THREE.Geometry = <THREE.Geometry> meshPlane.geometry;
        meshGeometry.computeBoundingBox();

        let vertexCount : number = meshGeometry.vertices.length;
        let clipRange   : number = this.farClipPlane - this.nearClipPlane;
        for (let iVertex : number = 0; iVertex < vertexCount; iVertex++) {

            // calculate index of vertex in depth buffer based on view extents and camera transform
            let vertex = meshGeometry.vertices[iVertex];
            let depthBufferVertex = this.getModelVertexIndex (vertex, meshGeometry.boundingBox);

            var depth = -this.depths[depthBufferVertex];
            meshGeometry.vertices[iVertex].z = depth;
        }

        meshGeometry.verticesNeedUpdate = true;
    }

    /**
     * Constructs a mesh plane of the given base dimension.
     * @param modelWidth Base dimension (model units). Height is controlled by DB aspect ration.
     * @param material Material to assign to mesh.
     */
    constructMeshPlane (modelWidth : number, material : THREE.Material) : THREE.Mesh {

        let modelHeight = modelWidth * this.aspectRatio;

        let meshGeometry = new THREE.PlaneGeometry(modelWidth, modelHeight, this.width, this.height);
        let mesh         = new THREE.Mesh(meshGeometry, material);
        mesh.name = DepthBuffer.MeshModelName;

        return mesh;
    }

    /**
     * Constructs a mesh of the given base dimension.
     * @param modelWidth Base dimension (model units). Height is controlled by DB aspect ration.
     * @param material Material to assign to mesh.
     */
    mesh (modelWidth : number, material? : THREE.Material) : THREE.Mesh {

        if (!material)
            material = new THREE.MeshPhongMaterial({wireframe : false, color : 0xff00ff, reflectivity : 0.75, shininess : 0.75});

        // construct plane of given dimensions; resolution = depth buffer
        let mesh : THREE.Mesh = this.constructMeshPlane(modelWidth, material);

        // tranlate mesh points to respective depths
        this.transformMeshPlaneToMesh(mesh);

        return mesh;
    }
}