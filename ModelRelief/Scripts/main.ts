// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

"use strict";
import * as THREE   from 'three' 

import {Viewer}     from "Viewer"
import {OBJLoader}  from "OBJLoader"

export class ModelRelief {

    constructor() {  
    }
    
    loadModel (viewer : Viewer) {

        let modelNameElement : HTMLElement = window.document.getElementById('modelName');
        let modelPathElement : HTMLElement = window.document.getElementById('modelPath');

        let modelName    : string = modelNameElement.textContent;
        let modelPath    : string = modelPathElement.textContent;
        let fileName     : string = modelPath + modelName;

        let manager = new THREE.LoadingManager();
        let loader  = new OBJLoader(manager);
        var onProgress = function (xhr) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log(percentComplete.toFixed(2) + '% downloaded');
            }
        };

        var onError = function (xhr) {
        };        

        loader.load(fileName, function (object) {
            viewer.scene.add(object);
        }, onProgress, onError);
    }

    run () {
        console.log ('ModelRelief started');   

        let viewer = new Viewer(<HTMLCanvasElement> document.getElementById('model3D'));

        this.loadModel (viewer);
    }
}

let modelRelief = new ModelRelief();
modelRelief.run();
