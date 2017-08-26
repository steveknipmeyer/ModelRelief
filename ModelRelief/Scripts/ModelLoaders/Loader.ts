// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 

import {StandardView}               from 'Camera'
import {Logger, ConsoleLogger}      from 'Logger'
import {Graphics}                   from "Graphics"
import {OBJLoader}                  from "OBJLoader"
import {Services}                   from 'Services'
import {TestModelLoader, TestModel} from 'TestModelLoader'
import {Viewer}                     from 'Viewer'

const testModelColor = '#558de8';

export class Loader {

    /** Default constructor
     * @class Loader
     * @constructor
     */
    constructor() {  
    }

    /**
     * Loads a model based on the model name and path embedded in the HTML page.
     * @param viewer Instance of the Viewer to display the model.
     */    
    loadOBJModel (viewer : Viewer) {

        let modelNameElement : HTMLElement = window.document.getElementById('modelName');
        let modelPathElement : HTMLElement = window.document.getElementById('modelPath');
            
        let modelName    : string = modelNameElement.textContent;
        let modelPath    : string = modelPathElement.textContent;
        let fileName     : string = modelPath + modelName;

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
            
            viewer.model = group;
            viewer.setCameraToStandardView(StandardView.Front)                       
        }, onProgress, onError);
    }

    /**
     * Loads a parametric test model.
     * @param viewer Instance of the Viewer to display the model.
     * @param modelType Test model type (Spher, Box, etc.)
     */    
    loadParametricTestModel (viewer : Viewer, modelType : TestModel) {

        let testLoader = new TestModelLoader();
        testLoader.loadTestModel(viewer, modelType);
    }
}
