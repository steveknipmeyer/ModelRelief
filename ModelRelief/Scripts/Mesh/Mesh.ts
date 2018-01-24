// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

"use strict";

import * as THREE from 'three'

import { DepthBuffer }              from 'DepthBuffer'
import { Graphics }                 from 'Graphics'
import { Logger, ConsoleLogger }    from 'Logger'
import { MathLibrary }              from 'Math'
import { Services }                 from 'Services'
import { StopWatch }                from 'StopWatch'
import { Tools }                    from 'Tools'

/**
 * @description Constructor parameters for Mesh.
 * @export
 * @interface MeshParameters
 */
export interface MeshParameters {

    width       : number,                // width of mesh
    height      : number,                // height of mesh
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

/**
 * @description Relief.
 * @export
 * @interface Relief
 */
export interface Relief {

    width       : number;                // width of relief             
    height      : number;                // height of relief
    mesh        : THREE.Mesh;            // mesh
    depthBuffer : DepthBuffer;           // depth buffer
}

/**
 * @class
 * Mesh
 */
export class Mesh {
    _width           : number;          // width resolution of the DB
    _height          : number;          // height resolution of the DB
    _depthBuffer     : DepthBuffer;     // depth buffer

    _logger          : Logger                   = null;     // logger

    /**
     * @constructor
     * @param parameters Initialization parameters (MeshParameters)
     */
    constructor(parameters:MeshParameters) {

        // required
        this._width       = parameters.width;
        this._height      = parameters.height;
        this._depthBuffer = parameters.depthBuffer;

        this.initialize();
    }


    //#region Properties
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

        this._logger = Services.consoleLogger;
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
     * Generates a mesh from the active model and camera.
     * @param parameters Generation parameters (MeshGenerateParameters)
     */
    generateRelief(parameters: MeshGenerateParameters): Relief {

        if (!this.verifyMeshSettings())
            return null;

        let mesh = this._depthBuffer.mesh();
        let relief: Relief = {

            width:  this._width,
            height: this._height,
            mesh: mesh,
            depthBuffer: this._depthBuffer
        };

        return relief;
    }
    //#endregion
}

