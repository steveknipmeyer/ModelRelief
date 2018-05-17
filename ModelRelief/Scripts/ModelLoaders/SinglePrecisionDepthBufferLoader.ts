// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                   from 'three';

import {DepthBuffer}                from 'DepthBuffer'
import {Graphics}                   from 'Graphics';
import {ILogger, ConsoleLogger}     from 'Logger';
import {Services}                   from 'Services';

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

        let modelGroup = new THREE.Group();
        return modelGroup;
    }
}
