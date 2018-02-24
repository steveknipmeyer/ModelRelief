// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto   from 'DtoModels'
import * as THREE from 'three'

import { assert }                   from 'chai'
import { Camera }                   from 'Camera'
import { CameraHelper }             from 'CameraHelper'
import { DepthBuffer }              from 'DepthBuffer'
import { GeneratedFileModel }       from 'GeneratedFileModel'
import { Graphics }                 from 'Graphics'
import { MeshFormat }               from 'IMesh'
import { ILogger, ConsoleLogger }   from 'Logger'
import { MathLibrary }              from 'Math'
import { MeshCache }                from 'MeshCache'
import { MeshTransform }            from 'MeshTransform'
import { Project }                  from 'Project'
import { Services }                 from 'Services'
import { StopWatch }                from 'StopWatch'
import { Tools }                    from 'Tools'

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
 * @description Represents a mesh.
 * @export
 * @class Mesh
 */
export class Mesh extends GeneratedFileModel<Mesh> {

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

    format: MeshFormat;

    // Navigation Properties    
    projectId       : number;
    project         : Project;

    cameraId        : number;
    camera          : Camera;             

    depthBufferId   : number;
    depthBuffer     : DepthBuffer;

    meshTransformId : number;
    meshTransform   : MeshTransform;

    // Private
    _width      : number;          // width resolution of the DepthBuffer
    _height     : number;          // height resolution of the DepthBuffer

    _logger     : ILogger;          // logger
    
    /**
     * Creates an instance of Mesh.
     * @param {DepthBuffer} depthBuffer Depth buffer.
     */
    constructor(depthBuffer : DepthBuffer) {

        super({
            name: 'Mesh', 
            description: 'Mesh',
        });

        this._width       = depthBuffer.width;
        this._height      = depthBuffer.height;
        this.depthBuffer  = depthBuffer;

        this.initialize();
    }
    
    /**
     * @description Returns a Mesh instance through an HTTP query of the Id.
     * @static
     * @param {number} id Mesh Id.
     * @returns {Promise<Mesh>} 
     */
    static async fromId(id : number ) : Promise<Mesh> {
        
        let mesh = new Dto.Mesh ({
            id : id
        });
        let meshModel = await mesh.getAsync();
        return Mesh.fromDtoModel(meshModel);
    }   

    /**
     * @description Constructs an instance from a DTO model.
     * @returns {Mesh} 
     */
    static fromDtoModel(dtoMesh : Dto.Mesh) : Mesh {

        let depthBuffer : DepthBuffer = undefined;       // N.B. != Dto.Mesh

        // constructor
        let mesh = new Mesh (depthBuffer);

        mesh.id          = dtoMesh.id;
        mesh.name        = dtoMesh.name;
        mesh.description = dtoMesh.description;       

        mesh.format         = dtoMesh.format;
        mesh.projectId      = dtoMesh.projectId;
        mesh.depthBufferId  = dtoMesh.depthBufferId
        mesh.meshTransformId= dtoMesh.meshTransformId;

        return mesh;
    }

    /**
     * @description Returns a DTO Mesh from the instance.
     * @returns {Dto.Mesh} 
     */
    toDtoModel() : Dto.Mesh {

        let mesh = new Dto.Mesh({
            id              : this.id,
            name            : this.name,
            description     : this.description,    

            format          : this.format,
        
            projectId       : this.projectId,
            cameraId        : this.cameraId,
            depthBufferId   : this.depthBufferId,
            meshTransformId : this.meshTransformId,
        });

        return mesh;
    }        

    //#region Properties
    /**
     * @description Returns the width.
     * @readonly
     * @type {number}
     */
    get width(): number {
        return this._width;
    }

    /**
     * @description Returns the height.
     * @readonly
     * @type {number}
     */
    get height(): number {
        return this._height;
    }
    //#endregion

    //#region Initialization    
    /**
     * @description Perform setup and initialization.
     */
    initialize(): void {

        this._logger = Services.defaultLogger;
    }
    //#endregion

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

        let lowerLeft   = new THREE.Vector3(originX + 0,         originY + 0,        this.depthBuffer.depth(row + 0, column+ 0));             // baseVertexIndex + 0
        let lowerRight  = new THREE.Vector3(originX + faceSize,  originY + 0,        this.depthBuffer.depth(row + 0, column + 1));            // baseVertexIndex + 1
        let upperLeft   = new THREE.Vector3(originX + 0,         originY + faceSize, this.depthBuffer.depth(row + 1, column + 0));            // baseVertexIndex + 2
        let upperRight  = new THREE.Vector3(originX + faceSize,  originY + faceSize, this.depthBuffer.depth(row + 1, column + 1));            // baseVertexIndex + 3

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
       let depthCount = this.depthBuffer.depths.length;
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
    * @description Constructs a mesh of the given base dimension.
    * @param {THREE.Material} [material] Material to assign to mesh.
    * @returns {THREE.Mesh} 
    */
   constructGraphics(material? : THREE.Material) : THREE.Mesh {

       let timerTag = Services.timer.mark('DepthBuffer.mesh');        
       
       // The mesh size is in real world units to match the depth buffer offsets which are also in real world units.
       // Find the size of the near plane to size the mesh to the model units.
       let meshXYExtents : THREE.Vector2 = CameraHelper.getNearPlaneExtents(this.depthBuffer.camera.viewCamera);       
       
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
    async constructGraphicssAsync(parameters: MeshGenerateParameters): Promise<THREE.Mesh> {

        if (!this.verifyMeshSettings())
            return null;
    
        let mesh = this.constructGraphics();

        return mesh;
    }
    //#endregion
}
