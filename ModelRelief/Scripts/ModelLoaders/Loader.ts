// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto                             from 'DtoModels' ;
import * as THREE                           from 'three';

import {CameraHelper}                       from 'CameraHelper'
import {DepthBuffer}                        from 'DepthBuffer'
import {Graphics}                           from 'Graphics';
import {StandardView}                       from 'ICamera';
import {FileModel}                          from 'FileModel'
import {ILogger, ConsoleLogger}             from 'Logger';
import {MeshGenerateParameters}             from 'Mesh3d';
import {OBJLoader}                          from 'OBJLoader';
import {Services}                           from 'Services';
import {SinglePrecisionLoader}              from 'SinglePrecisionLoader';
import {SinglePrecisionDepthBufferLoader}   from 'SinglePrecisionDepthBufferLoader';
import {TestModelLoader, TestModel}         from 'TestModelLoader';
import {Viewer}                             from 'Viewer';
import {MeshFormat} from 'Api/V1/Interfaces/IMesh';

const testModelColor = '#558de8';

/**
 * @description Represents the model loader used to create Mesh objects from files.
 * @export
 * @class Loader
 */
export class Loader {

    /** Default constructor
     * @class Loader
     * @constructor
     */
    constructor() {  
    }

    /**
     * @description Loads a model based on the model name and path embedded in the HTML page.
     * @param {FileModel} fileModel Model to load.
     * @returns {Promise<THREE.Group>} 
     */
    async loadOBJModelAsync (fileModel : FileModel) : Promise<THREE.Group> {

        let modelFile = await fileModel.toDtoModel().getFileAsStringAsync();

        let loader = () => new Promise<THREE.Group>((resolve, reject) => {

            let manager = new THREE.LoadingManager();
            let loader  = new OBJLoader(manager);

            resolve(loader.parse(modelFile));
        });

        let modelGroup : THREE.Group = await loader();
        return modelGroup;
    }

    /**
     * @description Loads a single precision floating point depth buffer model.
     * @param {DepthBuffer} depthBuffer DepthBuffer to load.
     * @returns {Promise<THREE.Group>} 
     */
    async loadSDBModel (depthBuffer : DepthBuffer) : Promise<THREE.Group> {
        
        let loader = new SinglePrecisionDepthBufferLoader(depthBuffer);

        let modelGroup = await loader.loadModelAsync();
        return modelGroup;
    }

    /**
     * @description Loads a single precision float point model.
     * @param {FileModel} fileModel Model to load.
     */    
    async loadSPFModel (fileModel : FileModel) : Promise<THREE.Group> {

        // let loader = new SinglePrecisionLoader();
        // return await loader.loadModelAsync();

        let modelGroup = new THREE.Group();
        return modelGroup;
    }

    /**
     * @description Loads a parametric test model.
     * @param modelType Test model type (Sphere, Box, etc.)
     * @returns {Promise<THREE.Group>} 
     */    
    async loadParametricTestModel (modelType : TestModel) : Promise<THREE.Group>{

        let loader = new TestModelLoader();
        return loader.loadModelAsync(modelType);
    }
}
