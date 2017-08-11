// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE   from 'three' 

import {Logger, ConsoleLogger}  from 'Logger'
import {OBJLoader}              from "OBJLoader"
import {Services}               from 'Services'
import {Viewer              }   from "Viewer"

export class ModelRelief {

    /** Default constructor
     * @class ModelRelief
     * @constructor
     */
    constructor() {  
    }

    /**
     * Loads a model based on the model name and path embedded in the HTML page.
     * @param viewer Instance of the Viewer to display the model
     */    
    loadModel (viewer : Viewer) {

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
            
            viewer.root.add(group);

        }, onProgress, onError);
    }

    /**
     * Launch the model Viewer.
     */
    run () {

        Services.consoleLogger.addInfoMessage ('ModelRelief started');   

        let viewer = new Viewer(<HTMLCanvasElement> document.getElementById('model3D'));

        this.loadModel (viewer);
    }
}

let modelRelief = new ModelRelief();
modelRelief.run();

