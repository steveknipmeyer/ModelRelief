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
import {Logger, HTMLLogger} from 'Logger'
import {MathLibrary}        from 'Math'
import {Services}           from 'Services'
import {StopWatch}          from 'StopWatch'

export enum DepthBufferFormat {

    None,       // unknown   
    Raw,        // floating point array
    PNG,        // PNG format
    JPG         // JPG format
}

interface FacePair {
        
    vertices : THREE.Vector3[];
    faces    : THREE.Face3[];
}

interface FacePair {

    vertices: THREE.Vector3[];
    faces: THREE.Face3[];
}

/**
 *  Mesh cache to optimize mesh creation.
 *  If a mesh exists in the cache of the required dimensions, it is used as a template.
 *  @class
 */
class MeshCache {
    _cache : Map<string, THREE.Mesh>;

    /**
     * Constructor
     */
    constructor() {       
        this._cache = new Map();
    }

    /**
     * @description Generates the map key for a mesh.
     * @param {THREE.Vector2} modelExtents Extents of the camera near plane; model units.
     * @param {THREE.Vector2} pixelExtents Extents of the pixel array used to subdivide the mesh.
     * @returns {string}
     */
    generateKey(modelExtents : THREE.Vector2, pixelExtents : THREE.Vector2) : string{
        
        let aspectRatio = (modelExtents.x / modelExtents.y ).toFixed(2).toString();

        return `Aspect = ${aspectRatio} : Pixels = (${Math.round(pixelExtents.x).toString()}, ${Math.round(pixelExtents.y).toString()})`;
    }

    /**
     * @description Returns a mesh from the cache as a template (or null);
     * @param {THREE.Vector2} modelExtents Extents of the camera near plane; model units.
     * @param {THREE.Vector2} pixelExtents Extents of the pixel array used to subdivide the mesh.
     * @returns {THREE.Mesh}
     */
    getMesh(modelExtents: THREE.Vector2, pixelExtents: THREE.Vector2) : THREE.Mesh{
        
        let key: string = this.generateKey(modelExtents, pixelExtents);
        return this._cache[key];
    }

    /**
     * @description Adds a mesh instance to the cache.
     * @param {THREE.Vector2} modelExtents Extents of the camera near plane; model units.
     * @param {THREE.Vector2} pixelExtents Extents of the pixel array used to subdivide the mesh.
     * @param {THREE.Mesh} Mesh instance to add.
     * @returns {void} 
     */
    addMesh(modelExtents: THREE.Vector2, pixelExtents: THREE.Vector2, mesh : THREE.Mesh) : void {

        let key: string = this.generateKey(modelExtents, pixelExtents);
        if (this._cache[key])
            return;

        let meshClone = Graphics.cloneAndTransformObject(mesh);
        this._cache[key] = meshClone;
    }
}   

/**
 *  DepthBuffer 
 *  @class
 */
export class DepthBuffer {

    static Cache                          : MeshCache = new MeshCache();
    static readonly MeshModelName         : string = 'ModelMesh';
    static readonly NormalizedTolerance   : number = .001;    

    static DefaultMeshPhongMaterialParameters : THREE.MeshPhongMaterialParameters = {
    
        side: THREE.DoubleSide, 
        wireframe : false, 

        color: 0x42eef4, 
        specular: 0xffffff, 

        reflectivity : 0.75, 
        shininess : 100
    };
    
    _logger : Logger;

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
        
        this._logger = Services.consoleLogger;       

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
      * Constructs a pair of triangular faces at the given offset in the DepthBuffer.
      * @param row Row offset (Lower Left).
      * @param column Column offset (Lower Left).
      * @param faceSize Size of a face edge (not hypotenuse).
      * @param baseVertexIndex Beginning offset in mesh geometry vertex array.
      */
     constructTriFacesAtOffset (row : number, column : number, meshLowerLeft : THREE.Vector2, faceSize : number, baseVertexIndex : number) : FacePair {
         
         let facePair : FacePair = {
             vertices : [],
             faces    : []
         }

         //  Vertices
         //   2    3       
         //   0    1
     
         // complete mesh center will be at the world origin
         let originX : number = meshLowerLeft.x + (column * faceSize);
         let originY : number = meshLowerLeft.y + (row    * faceSize);
 
         let lowerLeft   = new THREE.Vector3(originX + 0,         originY + 0,        this.depth(row + 0, column+ 0));             // baseVertexIndex + 0
         let lowerRight  = new THREE.Vector3(originX + faceSize,  originY + 0,        this.depth(row + 0, column + 1));            // baseVertexIndex + 1
         let upperLeft   = new THREE.Vector3(originX + 0,         originY + faceSize, this.depth(row + 1, column + 0));            // baseVertexIndex + 2
         let upperRight  = new THREE.Vector3(originX + faceSize,  originY + faceSize, this.depth(row + 1, column + 1));            // baseVertexIndex + 3
 
         facePair.vertices.push(
              lowerLeft,             // baseVertexIndex + 0
              lowerRight,            // baseVertexIndex + 1
              upperLeft,             // baseVertexIndex + 2
              upperRight             // baseVertexIndex + 3
          );
 
          // right hand rule for polygon winding
          facePair.faces.push(
              new THREE.Face3(baseVertexIndex + 0, baseVertexIndex + 1, baseVertexIndex + 3),
              new THREE.Face3(baseVertexIndex + 0, baseVertexIndex + 3, baseVertexIndex + 2)
          );
             
         return facePair;
     }

     /**
      * @description Constructs a new mesh from an existing mesh of the same dimensions.
      * @param {THREE.Mesh} mesh Template mesh identical in model <and> pixel extents.
      * @param {THREE.Vector2} meshExtents Final mesh extents.
      * @param {THREE.Material} material Material to assign to the mesh.
      * @returns {THREE.Mesh} 
      */
     constructMeshFromTemplate(mesh : THREE.Mesh, meshExtents: THREE.Vector2, material: THREE.Material): THREE.Mesh {
       
        // The mesh template matches the aspect ratio of the template.
        // Now, scale the mesh to the final target dimensions.
        let boundingBox = Graphics.getBoundingBoxFromObject(mesh);
        let scale = meshExtents.x / boundingBox.getSize().x;
        mesh.scale.x = scale;
        mesh.scale.y = scale;
        
        let meshVertices = (<THREE.Geometry>mesh.geometry).vertices;
        let depthCount = this.depths.length;
        assert(meshVertices.length === depthCount);

        for (let iDepth = 0; iDepth < depthCount; iDepth++) {

            let modelDepth = this.normalizedToModelDepth(this.depths[iDepth]);
            meshVertices[iDepth].set(meshVertices[iDepth].x, meshVertices[iDepth].y, modelDepth);
        }
        let meshGeometry: THREE.Geometry = <THREE.Geometry>mesh.geometry;
        mesh = new THREE.Mesh(meshGeometry, material);
        
        return mesh;
     }

     /**
      * @description Constructs a new mesh from a collection of triangles.
      * @param {THREE.Vector2} meshXYExtents Extents of the mesh.
      * @param {THREE.Material} material Material to assign to the mesh.
      * @returns {THREE.Mesh} 
      */
    constructMesh(meshXYExtents : THREE.Vector2, material : THREE.Material) : THREE.Mesh {
        let meshGeometry = new THREE.Geometry();
        let faceSize: number = meshXYExtents.x / (this.width - 1);
        let baseVertexIndex: number = 0;

        let meshLowerLeft: THREE.Vector2 = new THREE.Vector2(-(meshXYExtents.x / 2), -(meshXYExtents.y / 2))

        for (let iRow = 0; iRow < (this.height - 1); iRow++) {
            for (let iColumn = 0; iColumn < (this.width - 1); iColumn++) {

                let facePair = this.constructTriFacesAtOffset(iRow, iColumn, meshLowerLeft, faceSize, baseVertexIndex);

                meshGeometry.vertices.push(...facePair.vertices);
                meshGeometry.faces.push(...facePair.faces);

                baseVertexIndex += 4;
            }
        }
        meshGeometry.mergeVertices();
        let mesh = new THREE.Mesh(meshGeometry, material);

        return mesh; 
    }

    /**
     * Constructs a mesh of the given base dimension.
     * @param meshXYExtents Base dimensions (model units). Height is controlled by DB aspect ratio.
     * @param material Material to assign to mesh.
     */
    mesh(material? : THREE.Material) : THREE.Mesh {

        let timerTag = Services.timer.mark('DepthBuffer.mesh');        
        
        // The mesh size is in real world units to match the depth buffer offsets which are also in real world units.
        // Find the size of the near plane to size the mesh to the model units.
        let meshXYExtents : THREE.Vector2 = Camera.getNearPlaneExtents(this.camera);       
        
        if (!material)
            material = new THREE.MeshPhongMaterial(DepthBuffer.DefaultMeshPhongMaterialParameters);

        let meshCache: THREE.Mesh = DepthBuffer.Cache.getMesh(meshXYExtents, new THREE.Vector2(this.width, this.height));
        let mesh: THREE.Mesh = meshCache ? this.constructMeshFromTemplate(meshCache, meshXYExtents, material) : this.constructMesh(meshXYExtents, material);   
        mesh.name = DepthBuffer.MeshModelName;
        
        let meshGeometry = <THREE.Geometry>mesh.geometry;
        meshGeometry.verticesNeedUpdate = true;
        meshGeometry.normalsNeedUpdate  = true;
        meshGeometry.elementsNeedUpdate = true;

        let faceNormalsTag = Services.timer.mark('meshGeometry.computeFaceNormals');
        meshGeometry.computeVertexNormals();
        meshGeometry.computeFaceNormals();
        Services.timer.logElapsedTime(faceNormalsTag);

        // Mesh was constructed with Z = depth buffer(X,Y).
        // Now rotate mesh to align with viewer XY plane so Top view is looking down on the mesh.
        mesh.rotateX(-Math.PI / 2);
        
        DepthBuffer.Cache.addMesh(meshXYExtents, new THREE.Vector2(this.width, this.height), mesh);
        Services.timer.logElapsedTime(timerTag)

        return mesh;
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