// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto                 from 'DtoModels'
import * as THREE               from 'three'

import { Camera }                       from 'Camera'
import { CameraHelper }                 from 'CameraHelper'
import { assert }                       from 'chai'
import { HttpLibrary, ServerEndPoints } from 'Http'
import { GeneratedFileModel }           from 'GeneratedFileModel'
import { Graphics }                     from 'Graphics'
import { DepthBufferFormat }            from 'IDepthBuffer';
import { IGeneratedFileModel }          from 'IGeneratedFileModel';
import { IModel }                       from 'IModel'
import { MathLibrary }                  from 'Math'
import { Mesh }                         from 'Mesh'
import { Model3d }                      from 'Model3d'
import { Project }                      from 'Project'
import { Services }                     from 'Services'
import { StopWatch }                    from 'StopWatch'

/**
 * @description Mesh generation parameters.
 * @export
 * @interface MeshGenerateParameters
 */
export interface MeshGenerateParameters {

    material?   : THREE.Material;
}

/**
 * @description Represents a subdivided rectangular face consisting of two triagnular faces.
 * @interface FacePair
 */
interface FacePair {

    vertices: THREE.Vector3[];
    faces: THREE.Face3[];
}

/**
 * @description Represents a depth buffer.
 * @export
 * @class DepthBuffer
 * @extends {GeneratedFileModel}
 */
export class DepthBuffer extends GeneratedFileModel {

    static readonly NormalizedTolerance   : number = .001;    

    depths     : Float32Array;

    width      : number;
    height     : number;
    format     : DepthBufferFormat;

    // Navigation Properties    
    project    : Project;
    model3d    : Model3d; 
    _camera    : Camera;

    // Private
    _rgbaArray       : Uint8Array;

    _nearClipPlane   : number;
    _farClipPlane    : number;
    _cameraClipRange : number;
    
    _minimumNormalized : number;
    _maximumNormalized : number;

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
    initialize () : void {

    }

    /**
     * @description Returns a DepthBuffer instance through an HTTP query of the Id.
     * @static
     * @param {number} id DepthBuffer Id.
     * @returns {Promise<DepthBuffer>} 
     */
    static async fromIdAsync(id : number ) : Promise<DepthBuffer> {
        
        if (!id)
            return undefined;

       let depthBuffer = new Dto.DepthBuffer ({
            id : id
        });
        let depthBufferModel = await depthBuffer.getAsync();
        return DepthBuffer.fromDtoModelAsync(depthBufferModel);
    }   

    /**
     * @description Constructs an instance from a DTO model.
     * @returns {DepthBuffer} 
     */
    static async fromDtoModelAsync(dtoDepthBuffer : Dto.DepthBuffer) : Promise<DepthBuffer> {

        // constructor
        let depthBuffer = new DepthBuffer({
            id          : dtoDepthBuffer.id,
            name        : dtoDepthBuffer.name,
            description : dtoDepthBuffer.description,       
        });

        depthBuffer.fileTimeStamp      = dtoDepthBuffer.fileTimeStamp;
        depthBuffer.fileIsSynchronized = dtoDepthBuffer.fileIsSynchronized;

        depthBuffer.width  = dtoDepthBuffer.width;
        depthBuffer.height = dtoDepthBuffer.height;

        depthBuffer.project = await Project.fromIdAsync(dtoDepthBuffer.projectId);
        depthBuffer.model3d = await Model3d.fromIdAsync(dtoDepthBuffer.model3dId);
        depthBuffer.camera  = await Camera.fromIdAsync(dtoDepthBuffer.cameraId);

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
        
            projectId       : this.project ? this.project.id : undefined,
            model3dId       : this.model3d ? this.model3d.id : undefined,
            cameraId        : this.camera  ? this.camera.id : undefined,
        });

        return model;
    }        

    //#region Properties
    /**
     * @description Returns the raw RGB array of the buffer.
     * @type {Uint8Array}
     */
    get rgbArray() : Uint8Array {

        return this._rgbaArray;
    }

    /**
     * @description Sets the raw RGB array.
     */
    set rgbArray (value : Uint8Array) {

        this._rgbaArray = value;

        // RGBA -> Float32
        this.depths = new Float32Array(this.rgbArray.buffer);
        
        // calculate extrema of depth buffer values
        this.calculateExtents();
    }

    /**
     * @description Returns the associated camera.
     * @readonly
     * @type {Camera}
     */
    get camera() : Camera {

        return this._camera;
    }

    /**
     * @description Sets the associated camera.
     */
    set camera(value : Camera) {

        this._camera = value;
        if (this._camera) {
            this._nearClipPlane   = this.camera.viewCamera.near;
            this._farClipPlane    = this.camera.viewCamera.far;
            this._cameraClipRange = this._farClipPlane - this._nearClipPlane;
        }
    }

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

    /**
     * @description Constructs a graphics mesh.
     * @returns {Promise<THREE.Group>} 
     */
    async getModelGroupAsync() : Promise<THREE.Group> {

        return this.constructGraphicssAsync();
    }

    //#region Generation
    /**
     * @description Verifies the pre-requisite settings are defined to create a mesh.
     * @returns {boolean} 
     */
    verifyMeshSettings(): boolean {

        let minimumSettingsDefined: boolean = true
        let errorPrefix: string = 'Mesh: ';

        return minimumSettingsDefined;
    }

    /**
     * @description Constructs a pair of triangular faces at the given offset in the DepthBuffer.
     * @param {number} row Row offset (Lower Left).
     * @param {number} column Column offset (Lower Left).
     * @param {THREE.Vector2} meshLowerLeft World coordinated of lower left.
     * @param {number} faceSize Size of a face edge (not hypotenuse).
     * @param {number} baseVertexIndex Beginning offset in mesh geometry vertex array.
     * @returns {FacePair} 
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
    constructGraphicsFromTemplate(mesh : THREE.Mesh, meshExtents: THREE.Vector2, material: THREE.Material): THREE.Mesh {
      
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
   constructGraphicsByTriangulation(meshXYExtents : THREE.Vector2, material : THREE.Material) : THREE.Mesh {
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
    * @description Constructs a mesh of the given base dimension.
    * @param {THREE.Material} [material] Material to assign to mesh.
    * @returns {THREE.Mesh} 
    */
   constructGraphics(material? : THREE.Material) : THREE.Mesh {

       let timerTag = Services.timer.mark('DepthBuffer.mesh');        
       
       // The mesh size is in real world units to match the depth buffer offsets which are also in real world units.
       // Find the size of the near plane to size the mesh to the model units.
       let meshXYExtents : THREE.Vector2 = CameraHelper.getNearPlaneExtents(this.camera.viewCamera);       
       
       if (!material)
           material = new THREE.MeshPhongMaterial(Mesh.DefaultMeshPhongMaterialParameters);

       let meshCache: THREE.Mesh = Mesh.Cache.getMesh(meshXYExtents, new THREE.Vector2(this.width, this.height));
       let mesh: THREE.Mesh = meshCache ? this.constructGraphicsFromTemplate(meshCache, meshXYExtents, material) : this.constructGraphicsByTriangulation(meshXYExtents, material);   
       mesh.name = Mesh.MeshModelName;
       
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
       
       Mesh.Cache.addMesh(meshXYExtents, new THREE.Vector2(this.width, this.height), mesh);
       Services.timer.logElapsedTime(timerTag)

       return mesh;
   } 

    /**
     * @description Generates a mesh from the active model and camera.
     * @param {MeshGenerateParameters} parameters 
     * @returns {Promise<THREE.Mesh>} Generation parameters (MeshGenerateParameters)
     */
    async constructGraphicssAsync(parameters: MeshGenerateParameters = {}): Promise<THREE.Mesh> {

        if (!this.verifyMeshSettings())
            return null;
    
        let mesh = this.constructGraphics();

        return mesh;
    }
    //#endregion    
}