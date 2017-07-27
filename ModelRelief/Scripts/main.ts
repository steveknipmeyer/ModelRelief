// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

"use strict";
import * as THREE       from 'three' 
import * as MRViewer    from "Viewer"
import * as MROBJLoader from "OBJLoader"

export class ModelRelief {

    constructor() {  
    }
     
    run () {
        console.log ('ModelRelief started');   

        var viewer = new MRViewer.Viewer(<HTMLCanvasElement> document.getElementById('model3D'));

        let modelNameElement : HTMLElement = window.document.getElementById('modelName');
        let modelPathElement : HTMLElement = window.document.getElementById('modelPath');

        let modelName    : string = modelNameElement.textContent;
        let modelPath    : string = modelPathElement.textContent;
        let fileName     : string = modelName;
        let texturePath  : string = modelPath;
        let materialFile : string = modelName.replace(/\.[^/.]+$/, "") + '.mtl';
        let prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile(
            modelName,
            modelPath,
            fileName,
            texturePath,
            materialFile
        );

        let loader = new MROBJLoader.OBJLoader(viewer.pivot);
        loader.loadFiles (prepData);
    }
}

let modelRelief = new ModelRelief();
modelRelief.run();
