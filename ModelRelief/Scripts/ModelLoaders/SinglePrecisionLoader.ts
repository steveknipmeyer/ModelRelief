// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                   from 'three';

import {Graphics}                   from 'Graphics';
import {ILogger, ConsoleLogger}     from 'Logger';
import {Services}                   from 'Services';

/**
 * @description Represents the model loader used to create Mesh objects from single precision floating point (*.sfp) files.
 * @export
 * @class SinglePrecisionLoader
 */
export class SinglePrecisionLoader {

    // Private

    /**
     * Creates an instance of SinglePrecisionLoader.
     */
    constructor() {  
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
