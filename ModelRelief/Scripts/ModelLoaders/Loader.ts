// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto                     from 'DtoModels' ;
import * as THREE                   from 'three';

import {StandardView}               from "ICamera";
import {Graphics}                   from "Graphics";
import {ILogger, ConsoleLogger}     from 'Logger';
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
     * @param {Viewer} viewer Instance of the Viewer to display the model.
     */
    loadOBJModel (viewer : Viewer) {

        {
            let modelIdElement : HTMLElement = window.document.getElementById('modelId');
            let modelId = parseInt(modelIdElement.textContent);
            let model = new Dto.Model3d({id: modelId});
            let result = model.getAsync().then(model => {

            });
        }

        let modelNameElement : HTMLElement = window.document.getElementById('modelName');
        let modelPathElement : HTMLElement = window.document.getElementById('modelPath');
            
        let modelName    : string = modelNameElement.textContent;
        let modelPath    : string = modelPathElement.textContent;
        let fileName     : string = `${modelPath}${modelName}`;       

        let manager = new THREE.LoadingManager();
        let loader  = new OBJLoader(manager);
        
        let onProgress = function (xhr) {

            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log(percentComplete.toFixed(2) + '% downloaded');
            }
        };

        let onError = function (xhr) {
        };        

        loader.load(fileName, function (group : THREE.Group) {
            
            viewer.setModel(group);
        }, onProgress, onError);
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
