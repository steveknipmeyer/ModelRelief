// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                                   from 'three';

import { assert }                                   from 'chai'
import {Graphics}                                   from 'Graphics';
import {IFacePair, Mesh3d, IMeshGenerateParameters}   from 'Mesh3d';
import {Services}                                   from 'Services';

/**
 * @description Represents the model loader used to create Mesh objects from single precision floating point files.
 * @export
 * @class SinglePrecisionLoader
 */
export class SinglePrecisionLoader {

    meshParameters : IMeshGenerateParameters;
    values        : Float32Array;
    transformer   : (number) => number;
    bufferExtents : THREE.Vector2;
    meshExtents   : THREE.Vector2;

    /**
     * Creates an instance of SinglePrecisionLoader.
     * @param {IMeshGenerateParameters} parameters Mesh generation parameters.
     * @param {Float32Array} values List of floats comprising the mesh values.
     *                              Row major order beginning at the bottom row.
     * @param {(number) => number} trasnformer Transform function that maps raw values to model values.
     * @param {THREE.Vector2} bufferExtents Buffer XY extents.
     * @param {THREE.Vector2} meshExtents Mesh XY extents.
    */
    constructor(meshParameters : IMeshGenerateParameters, values : Float32Array, transformer : (number) => number, bufferExtents : THREE.Vector2, meshExtents : THREE.Vector2) {

        this.meshParameters = meshParameters;
        this.values         = values;
        this.transformer    = transformer;
        this.bufferExtents  = bufferExtents;
        this.meshExtents    = meshExtents;
    }

    /**
     * @description Loads a model.
     * @returns {Promise<THREE.Group>}
     */
    async loadModelAsync () : Promise<THREE.Group> {

        if (!this.verifyMeshSettings())
            return null;

        let mesh = this.constructGraphics();

        return mesh;
    }

    /**
     * @description Returns the buffer value at a pixel index.
     * @param {number} row Buffer row.
     * @param {any} column Buffer column.
     * @returns {number}
     */
    value(row : number, column) : number {

        let index = (Math.round(row) * this.bufferExtents.x) + Math.round(column);
        let valueRaw = this.values[index];

        let value = this.transformer(valueRaw);

        return value;
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
     * @description Constructs a pair of triangular faces at the given offset in the buffer.
     * @param {number} row Row offset (Lower Left).
     * @param {number} column Column offset (Lower Left).
     * @param {THREE.Vector2} meshLowerLeft World coordinated of lower left.
     * @param {number} faceSize Size of a face edge (not hypotenuse).
     * @param {number} baseVertexIndex Beginning offset in mesh geometry vertex array.
     * @returns {IFacePair}
     */
    constructTriFacesAtOffset (row : number, column : number, meshLowerLeft : THREE.Vector2, faceSize : number, baseVertexIndex : number) : IFacePair {

        let facePair : IFacePair = {
            vertices : [],
            faces    : []
        }

        //  Vertices
        //   2    3
        //   0    1

        // complete mesh center will be at the world origin
        let originX : number = meshLowerLeft.x + (column * faceSize);
        let originY : number = meshLowerLeft.y + (row    * faceSize);

        let lowerLeft   = new THREE.Vector3(originX + 0,         originY + 0,        this.value(row + 0, column+ 0));             // baseVertexIndex + 0
        let lowerRight  = new THREE.Vector3(originX + faceSize,  originY + 0,        this.value(row + 0, column + 1));            // baseVertexIndex + 1
        let upperLeft   = new THREE.Vector3(originX + 0,         originY + faceSize, this.value(row + 1, column + 0));            // baseVertexIndex + 2
        let upperRight  = new THREE.Vector3(originX + faceSize,  originY + faceSize, this.value(row + 1, column + 1));            // baseVertexIndex + 3

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
        let valueCount = this.values.length;
        assert(meshVertices.length === valueCount);

        for (let iValue = 0; iValue < valueCount; iValue++) {

            let modelValue = this.transformer(this.values[iValue]);
            meshVertices[iValue].set(meshVertices[iValue].x, meshVertices[iValue].y, modelValue);
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
       let faceSize: number = meshXYExtents.x / (this.bufferExtents.x - 1);
       let baseVertexIndex: number = 0;

       let meshLowerLeft: THREE.Vector2 = new THREE.Vector2(-(meshXYExtents.x / 2), -(meshXYExtents.y / 2))

       for (let iRow = 0; iRow < (this.bufferExtents.y - 1); iRow++) {
           for (let iColumn = 0; iColumn < (this.bufferExtents.x - 1); iColumn++) {

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

       let timerTag = Services.timer.mark('SinglePrecisionLoader.constructGraphics');

       if (!material)
           material = new THREE.MeshPhongMaterial(Mesh3d.DefaultMeshPhongMaterialParameters);

       // The mesh size is in real world units to match the buffer values which are also in real world units.
       // Find the size of the near plane to size the mesh to the model units.

       let meshCache: THREE.Mesh = Mesh3d.Cache.getMesh(this.meshExtents, new THREE.Vector2(this.bufferExtents.x, this.bufferExtents.y));
       meshCache = null;
       let mesh: THREE.Mesh = meshCache ? this.constructGraphicsFromTemplate(meshCache, this.meshExtents, material) : this.constructGraphicsByTriangulation(this.meshExtents, material);
       mesh.name = this.meshParameters.name;

       let meshGeometry = <THREE.Geometry>mesh.geometry;
       meshGeometry.verticesNeedUpdate = true;
       meshGeometry.normalsNeedUpdate  = true;
       meshGeometry.elementsNeedUpdate = true;

       let faceNormalsTag = Services.timer.mark('meshGeometry.computeFaceNormals');
       meshGeometry.computeVertexNormals();
       meshGeometry.computeFaceNormals();
       Services.timer.logElapsedTime(faceNormalsTag);

       // Mesh was constructed with Z = buffer(X,Y).
       // Now rotate mesh to align with viewer XY plane so Top view is looking down on the mesh.
       mesh.rotateX(-Math.PI / 2);

       Mesh3d.Cache.addMesh(this.meshExtents, new THREE.Vector2(this.bufferExtents.x, this.bufferExtents.y), mesh);
       Services.timer.logElapsedTime(timerTag)

       return mesh;
   }
}
