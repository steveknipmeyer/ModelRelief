// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

"use strict";
namespace MR {

    export class OBJLoader {
        
        pivot     : THREE.Object3D;
        loader    : any;                // THREE.OBJLoader2.WWOBJLoader2();
        validator : any;                // Validator

        constructor(pivot : THREE.Object3D) {
            let scope = this;
            
            this.pivot = pivot;

            this.loader = new THREE.OBJLoader2.WWOBJLoader2();
            this.loader.setCrossOrigin('anonymous');

            this.loader.registerCallbackProgress(this.reportProgress.bind(scope));
            this.loader.registerCallbackCompletedLoading(this.completedLoading.bind(scope));
            this.loader.registerCallbackMaterialsLoaded(this.materialsLoaded.bind(scope));
            this.loader.registerCallbackMeshLoaded(this.meshLoaded.bind(scope));

            this.validator = THREE.OBJLoader2.prototype._getValidator();
        }

        reportProgress (content) {
            console.log('Progress: ' + content);
        };

        materialsLoaded (materials) {
            var count = this.validator.isValid(materials) ? materials.length : 0;
            console.log('Loaded #' + count + ' materials.');
        };

        meshLoaded (name, bufferGeometry, material) {
            console.log('Loaded mesh: ' + name + ' Material name: ' + material.name);
            /*
                        let meshParameters : THREE.MeshDepthMaterialParameters;
                        let depthMaterial = new THREE.MeshDepthMaterial();
                        return new THREE.OBJLoader2.WWOBJLoader2.LoadedMeshUserOverride (false, null, depthMaterial);
            */
            return new THREE.OBJLoader2.WWOBJLoader2.LoadedMeshUserOverride(false, null, new THREE.MeshPhongMaterial());
        };

        completedLoading () {
            console.log('Loading complete!');
        };

        loadFiles(prepData) {
            prepData.setSceneGraphBaseNode(this.pivot);
            prepData.setStreamMeshes(true);
            this.loader.prepareRun(prepData);
            this.loader.run();
        };
    }
}