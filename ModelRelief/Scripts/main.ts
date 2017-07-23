// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

"use strict";
namespace MR {

    class Dummy {
        constructor() {
            var prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile();
        }
    }

    export function main() {
        
console.log ('ModelRelief started');

        var viewer = new MR.Viewer(<HTMLCanvasElement> document.getElementById('model3D'));

        let modelNameElement : HTMLElement = window.document.getElementById('modelName');
        let modelPathElement : HTMLElement = window.document.getElementById('modelPath');

        let modelName    = modelNameElement.textContent;
        let modelPath    = modelPathElement.textContent;
        let fileName     = modelName;
        let texturePath  = modelPath;
        let materialFile = modelName.replace(/\.[^/.]+$/, "") + '.mtl';
        let prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile(
            modelName,
            modelPath,
            fileName,
            texturePath,
            materialFile
        );

        let loader = new MR.OBJLoader(viewer.pivot);
        loader.loadFiles (prepData);
    }
}