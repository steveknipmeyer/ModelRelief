// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto                     from 'DtoModels' ;
import * as THREE                   from 'three';

import {FileModel}                  from 'FileModel';
import {Graphics}                   from 'Graphics';
import {StandardView}               from 'ICamera';
import {IFileModel}                 from 'IFileModel';
import {IModel}                     from 'IModel'
import {ILogger, ConsoleLogger}     from 'Logger';
import {Model}                      from 'Model';
import {OBJLoader}                  from 'OBJLoader';
import {Services}                   from 'Services';
import {TestModelLoader, TestModel} from 'TestModelLoader';
import {Viewer}                     from 'Viewer';

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
     * @param {IFileModel} fileModel Model to load.
     * @returns {Promise<THREE.Group>} 
     */
    async loadOBJModelAsync (fileModel : IFileModel) : Promise<THREE.Group> {

        let modelFile = await fileModel.getFileAsStringAsync();

        let loader = () => new Promise<THREE.Group>((resolve, reject) => {

            let manager = new THREE.LoadingManager();
            let loader  = new OBJLoader(manager);

            resolve(loader.parse(modelFile));
        });

        let modelGroup : THREE.Group = await loader();
        return modelGroup;
    }

    /**
     * @description Loads a parametric test model.
     * @param viewer Instance of the Viewer to display the model.
     * @param modelType Test model type (Spher, Box, etc.)
     */    
    loadParametricTestModel (viewer : Viewer, modelType : TestModel) {

        let testLoader = new TestModelLoader();
        testLoader.loadTestModel(viewer, modelType);
    }
}
