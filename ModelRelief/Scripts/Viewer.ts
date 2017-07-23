// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

"use strict";
namespace MR {    
    interface CameraDefaults {
        position        : THREE.Vector3;        // location of camera
        target          : THREE.Vector3;        // target point
        near            : number;               // near clipping plane
        far             : number;               // far clipping plane
        fov             : number;               // field of view
    }

    export class Viewer  {
            Validator          : Validator;

            renderer           : THREE.WebGLRenderer;
            canvas             : HTMLCanvasElement;
            aspectRatio        : number;

            scene              : THREE.Scene;
            camera             : THREE.PerspectiveCamera;
            cameraDefaults     : CameraDefaults;
            cameraTarget       : THREE.Vector3;
            controls           : THREE.TrackballControls;
         
            smoothShading      : boolean;          // smooth shading
            doubleSide         : boolean;          // doble-sided materials
            streamMeshes       : boolean;          // ?
            pathTexture        : string;           // relative path to textures

            pivot              : THREE.Object3D;
            wwObjLoader2       : WWOBJLoader2;
            fileApiAvailable   : boolean;
            traversalFunction  : (material : THREE.Material) => any;

        constructor (elementToBindTo : HTMLCanvasElement) {
            this.Validator = THREE.OBJLoader2.prototype._getValidator();

            this.renderer = null;
            this.canvas = elementToBindTo;
            this.aspectRatio = 1;
            this.recalcAspectRatio();

            this.scene = null;

            this.cameraDefaults = {

                // Baseline : near = 0.1, far = 10000
                // ZBuffer  : near = 100, far = 300
                position: new THREE.Vector3(0.0, 175.0, 500.0),
                target: new THREE.Vector3(0, 0, 0),
                near: 0.1,                       
                far: 10000,                               
                fov: 45
            };
            this.camera = null;
            this.cameraTarget = this.cameraDefaults.target;

            this.controls = null;

            this.smoothShading = true;
            this.doubleSide = false;
            this.streamMeshes = true;
            this.pivot = null;

            this.wwObjLoader2 = new THREE.OBJLoader2.WWOBJLoader2();
            this.wwObjLoader2.setCrossOrigin('anonymous');

            // Check for the various File API support.
            this.fileApiAvailable = true;
            if (File && FileReader && FileList && Blob) {
                console.log('File API is supported! Enabling all features.');
            } else {
                this.fileApiAvailable = false;
                console.warn('File API is not supported! Disabling file loading.');
            }
        }

        initGL () {
            let scope = this;

            this.renderer = new THREE.WebGLRenderer({
                logarithmicDepthBuffer: false,
                canvas: this.canvas,
                antialias: true,
            });
            this.renderer.autoClear = true;
            this.renderer.setClearColor(0x050505);
            this.renderer.setClearColor(0xf0f0f0);
            this.renderer.setClearColor(0x000000);
            this.scene = new THREE.Scene();

            this.camera = new THREE.PerspectiveCamera(this.cameraDefaults.fov, this.aspectRatio, this.cameraDefaults.near, this.cameraDefaults.far);
            this.resetCamera();

            this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);

            var ambientLight = new THREE.AmbientLight(0x404040);
            var directionalLight1 = new THREE.DirectionalLight(0xC0C090);
            var directionalLight2 = new THREE.DirectionalLight(0xC0C090);
            directionalLight1.position.set(-100, -50, 100);
            directionalLight2.position.set(100, 50, -100);
            this.scene.add(directionalLight1);
            this.scene.add(directionalLight2);
            this.scene.add(ambientLight);
            
            var helper = new THREE.GridHelper(300, 30, 0x86e6ff, 0x999999);
            this.scene.add(helper);

            this.createPivot();
        };

        createPivot () {
            this.pivot = new THREE.Object3D();
            this.pivot.name = 'Pivot';
            this.scene.add(this.pivot);
        };

        initPostGL () {
            var scope = this;

            var reportProgress = function (content) {
                console.log('Progress: ' + content);
            };
            var materialsLoaded = function (materials) {
                var count = scope.Validator.isValid(materials) ? materials.length : 0;
                console.log('Loaded #' + count + ' materials.');
            };
            var meshLoaded = function (name, bufferGeometry, material) {
                console.log('Loaded mesh: ' + name + ' Material name: ' + material.name);
    /*
                let meshParameters : THREE.MeshDepthMaterialParameters;
                let depthMaterial = new THREE.MeshDepthMaterial();
                return new THREE.OBJLoader2.WWOBJLoader2.LoadedMeshUserOverride (false, null, depthMaterial);
    */
                return new THREE.OBJLoader2.WWOBJLoader2.LoadedMeshUserOverride (false, null, new THREE.MeshPhongMaterial());
            };
            var completedLoading = function () {
                console.log('Loading complete!');
            };

            this.wwObjLoader2.registerCallbackProgress(reportProgress);
            this.wwObjLoader2.registerCallbackCompletedLoading(completedLoading);
            this.wwObjLoader2.registerCallbackMaterialsLoaded(materialsLoaded);
            this.wwObjLoader2.registerCallbackMeshLoaded(meshLoaded);
            return true;
        };

        loadFiles (prepData) {
            prepData.setSceneGraphBaseNode(this.pivot);
            prepData.setStreamMeshes(this.streamMeshes);
            this.wwObjLoader2.prepareRun(prepData);
            this.wwObjLoader2.run();
        };

        _handleFileSelect (event, pathTexture) {
            var scope = this;

            var fileObj = null;
            var fileMtl = null;
            var files = event.target.files;
            for (var i = 0, file; file = files[i]; i++) {
                if (file.name.indexOf('\.obj') > 0 && fileObj === null) {
                    fileObj = file;
                }
                if (file.name.indexOf('\.mtl') > 0 && fileMtl === null) {
                    fileMtl = file;
                }
            }
            if (!this.Validator.isValid(fileObj)) {
                alert('Unable to load OBJ file from given files.');
            }
            var fileReader = new FileReader();
            fileReader.onload = function (fileDataObj) {
                let eventTarget : EventTarget = fileDataObj.target;
                var uint8Array = new Uint8Array((<any>eventTarget).result);
                if (fileMtl === null) {
                    scope.loadFilesUser({
                        name: 'userObj',
                        objAsArrayBuffer: uint8Array,
                        pathTexture: pathTexture,
                        mtlAsString: null
                    });
                } else {
                    fileReader.onload = function (fileDataMtl) {
                        let eventTarget : EventTarget = fileDataMtl.target;
                        scope.loadFilesUser({
                            name: 'userObj',
                            objAsArrayBuffer: uint8Array,
                            pathTexture: pathTexture,
                            mtlAsString: (<any>eventTarget).result
                        });
                    };
                    fileReader.readAsText(fileMtl);
                }
            };
            fileReader.readAsArrayBuffer(fileObj);
        };

        loadFilesUser (objDef) {
            var prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataArrayBuffer(
                objDef.name, objDef.objAsArrayBuffer, objDef.pathTexture, objDef.mtlAsString
            );
            prepData.setSceneGraphBaseNode(this.pivot);
            prepData.setStreamMeshes(this.streamMeshes);
            this.wwObjLoader2.prepareRun(prepData);
            this.wwObjLoader2.run();
        };

        resizeDisplayGL () {
            this.controls.handleResize();
            this.recalcAspectRatio();
            this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight, false);
            this.updateCamera();
        };

        recalcAspectRatio () {
            this.aspectRatio = (this.canvas.offsetHeight === 0) ? 1 : this.canvas.offsetWidth / this.canvas.offsetHeight;
        };

        resetCamera () {
            this.camera.position.copy(this.cameraDefaults.position);
            this.cameraTarget.copy(this.cameraDefaults.target);
            this.updateCamera();
        };

        updateCamera () {
            this.camera.aspect = this.aspectRatio;
            this.camera.lookAt(this.cameraTarget);
            this.camera.updateProjectionMatrix();
        };

        render () {
            if (!this.renderer.autoClear) this.renderer.clear();

            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };

        alterSmoothShading () {
            var scope = this;
            scope.smoothShading = !scope.smoothShading;
            console.log(scope.smoothShading ? 'Enabling SmoothShading' : 'Enabling FlatShading');
            scope.traversalFunction = function (material) {
                material.shading = scope.smoothShading ? THREE.SmoothShading : THREE.FlatShading;
                material.needsUpdate = true;
            };
            var scopeTraverse = function (object3d) {
                scope.traverseScene(object3d);
            };
            scope.pivot.traverse(scopeTraverse);
        };

        alterDouble () {
            var scope = this;
            scope.doubleSide = !scope.doubleSide;
            console.log(scope.doubleSide ? 'Enabling DoubleSide materials' : 'Enabling FrontSide materials');
            scope.traversalFunction = function (material) {
                material.side = scope.doubleSide ? THREE.DoubleSide : THREE.FrontSide;
            };
            var scopeTraverse = function (object3d) {
                scope.traverseScene(object3d);
            };
            scope.pivot.traverse(scopeTraverse);
        };

        traverseScene (object3d) {
            if (object3d.material instanceof THREE.MultiMaterial) {
                var materials = object3d.material.materials;
                for (var name in materials) {
                    if (materials.hasOwnProperty(name)) this.traversalFunction(materials[name]);
                }
            } else if (object3d.material) {
                this.traversalFunction(object3d.material);
            }
        };

        clearAllAssests () {
            var scope = this;
            var remover = function (object3d) {
                if (object3d === scope.pivot) {
                    return;
                }
                console.log('Removing: ' + object3d.name);
                scope.scene.remove(object3d);
                if (object3d.hasOwnProperty('geometry')) {
                    object3d.geometry.dispose();
                }
                if (object3d.hasOwnProperty('material')) {
                    var mat = object3d.material;
                    if (mat.hasOwnProperty('materials')) {
                        var materials = mat.materials;
                        for (var name in materials) {
                            if (materials.hasOwnProperty(name)) materials[name].dispose();
                        }
                    }
                }
                if (object3d.hasOwnProperty('texture')) {
                    object3d.texture.dispose();
                }
            };
            scope.scene.remove(scope.pivot);
            scope.pivot.traverse(remover);
            scope.createPivot();
        };
    }
}