// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                   from 'three';

import {CameraHelper}               from 'CameraHelper'
import {DepthBuffer}                from 'DepthBuffer'
import {ILogger, ConsoleLogger}     from 'Logger';
import {MeshGenerateParameters}     from 'Mesh3d';
import {Services}                   from 'Services';
import {SinglePrecisionLoader}      from 'SinglePrecisionLoader';

/**
 * @description Represents the model loader used to create Mesh objects from single precision depth buffer (*.sdb) files.
 * @export
 * @class SinglePrecisionDepthBufferLoader
 */
export class SinglePrecisionDepthBufferLoader {

    // Private
    _depthBuffer       : DepthBuffer;

    /**
     * Creates an instance of SinglePrecisionDepthBufferLoader.
     * @param {DepthBuffer} depthBuffer The parent DepthBuffer used to create the file.
     */
    constructor(depthBuffer : DepthBuffer) {  
        this._depthBuffer = depthBuffer;
    }

    /**
     * @description Loads a model.
     * @returns {Promise<THREE.Group>} 
     */
    async loadModelAsync () : Promise<THREE.Group> {

        let meshParameters : MeshGenerateParameters = {
            name : this._depthBuffer.name
        }    
        let transformer = (value : number) => {return value;};
            transformer = this._depthBuffer.normalizedToModelDepth.bind(this._depthBuffer);
        let bufferExtents = new THREE.Vector2(this._depthBuffer.width, this._depthBuffer.height);
        let meshExtents : THREE.Vector2 = CameraHelper.getNearPlaneExtents(this._depthBuffer.camera.viewCamera);
        
        let loader = new SinglePrecisionLoader(meshParameters, this._depthBuffer.depths, transformer, bufferExtents, meshExtents);

        let modelGroup = await loader.loadModelAsync();
        return modelGroup;
    }
}
