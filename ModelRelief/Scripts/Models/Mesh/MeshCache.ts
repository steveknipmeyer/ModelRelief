// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { Graphics }                 from 'Graphics';

/**
 *  Mesh cache to optimize mesh creation.
 *  If a mesh exists in the cache of the required dimensions, it is used as a template.
 *  @class
 */
export class MeshCache {
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
        
        let xExtents = modelExtents.x.toFixed(2).toString();
        let yExtents = modelExtents.y.toFixed(2).toString();
        return `Model Extents = (${xExtents}, ${yExtents}) : Pixels = (${Math.round(pixelExtents.x).toString()}, ${Math.round(pixelExtents.y).toString()})`;
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

