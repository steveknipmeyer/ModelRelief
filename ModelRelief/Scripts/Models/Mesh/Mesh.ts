// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

"use strict";

import * as THREE from 'three'

import { assert }                   from 'chai'
import { Camera }                   from 'Camera'
import { CameraHelper }             from 'CameraHelper'
import { DepthBuffer }              from 'DepthBuffer'
import { Graphics }                 from 'Graphics'
import { ILogger, ConsoleLogger }   from 'Logger'
import { MathLibrary }              from 'Math'
import { Model }                    from 'Model'
import { Services }                 from 'Services'
import { StopWatch }                from 'StopWatch'
import { Tools }                    from 'Tools'

/**
 * @description Constructor parameters for Mesh.
 * @export
 * @interface MeshParameters
 */
export interface MeshParameters {

    width       : number,                // width of mesh (DB resolution)
    height      : number,                // height of mesh (DB resolution)
    depthBuffer : DepthBuffer,           // depth buffer
}

/**
 * @description Mesh generation parameters.
 * @export
 * @interface MeshGenerateParameters
 */
export interface MeshGenerateParameters {

    camera?     : THREE.PerspectiveCamera;      // override not yet implemented 
    material?   : THREE.Material;
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
 * @description Represents a mesh.
 * @export
 * @class Mesh
 */
export class Mesh  {

    static Cache                              : MeshCache = new MeshCache();
    static readonly MeshModelName             : string = 'ModelMesh';
    static DefaultMeshPhongMaterialParameters : THREE.MeshPhongMaterialParameters = {
    
        side: THREE.DoubleSide, 
        wireframe : false, 

        color: 0x42eef4, 
        specular: 0xffffff, 

        reflectivity : 0.75, 
        shininess : 100
    };

    _width           : number;          // width resolution of the DB
    _height          : number;          // height resolution of the DB
    _depthBuffer     : DepthBuffer;     // depth buffer

    _logger          : ILogger;          // logger

    /**
     * @constructor
     * @param parameters Initialization parameters (MeshParameters)
     */
    constructor(parameters: MeshParameters) {

        // required
        this._width       = parameters.width;
        this._height      = parameters.height;
        this._depthBuffer = parameters.depthBuffer;

        this.initialize();
    }

    //#region Properties
    /**
     * Returns the width.
     * @returns {number}
     */
    get width(): number {
        return this._width;
    }

    /**
     * Returns the height.
     * @returns {number}
     */
    get height(): number {
        return this._height;
    }

    /**
     * Returns the associated DepthBuffer.
     * @returns DepthBuffer
     */
    get depthBuffer(): DepthBuffer {
        return this._depthBuffer;
    }
    //#endregion

    //#region Initialization    
    /**
     * Perform setup and initialization.
     */
    initialize(): void {

        this._logger = Services.defaultLogger;
    }
    //#endregion

    //#region Generation
    /**
     * Verifies the pre-requisite settings are defined to create a mesh.
     */
    verifyMeshSettings(): boolean {

        let minimumSettingsDefined: boolean = true
        let errorPrefix: string = 'Mesh: ';

        return minimumSettingsDefined;
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

        let lowerLeft   = new THREE.Vector3(originX + 0,         originY + 0,        this._depthBuffer.depth(row + 0, column+ 0));             // baseVertexIndex + 0
        let lowerRight  = new THREE.Vector3(originX + faceSize,  originY + 0,        this._depthBuffer.depth(row + 0, column + 1));            // baseVertexIndex + 1
        let upperLeft   = new THREE.Vector3(originX + 0,         originY + faceSize, this._depthBuffer.depth(row + 1, column + 0));            // baseVertexIndex + 2
        let upperRight  = new THREE.Vector3(originX + faceSize,  originY + faceSize, this._depthBuffer.depth(row + 1, column + 1));            // baseVertexIndex + 3

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
       let depthCount = this._depthBuffer.depths.length;
       assert(meshVertices.length === depthCount);

       for (let iDepth = 0; iDepth < depthCount; iDepth++) {

           let modelDepth = this.depthBuffer.normalizedToModelDepth(this.depthBuffer.depths[iDepth]);
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
    * Constructs a mesh of the given base dimension.
    * @param meshXYExtents Base dimensions (model units). Height is controlled by DB aspect ratio.
    * @param material Material to assign to mesh.
    */
   constructGraphics(material? : THREE.Material) : THREE.Mesh {

       let timerTag = Services.timer.mark('DepthBuffer.mesh');        
       
       // The mesh size is in real world units to match the depth buffer offsets which are also in real world units.
       // Find the size of the near plane to size the mesh to the model units.
       let meshXYExtents : THREE.Vector2 = CameraHelper.getNearPlaneExtents(this.depthBuffer.camera);       
       
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
     * Generates a mesh from the active model and camera.
     * @param parameters Generation parameters (MeshGenerateParameters)
     */
    async constructGraphicssAsync(parameters: MeshGenerateParameters): Promise<THREE.Mesh> {

        if (!this.verifyMeshSettings())
            return null;
    
        let mesh = this.constructGraphics();

        return mesh;
    }
    //#endregion
}

