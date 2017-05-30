// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
var MR;
(function (MR) {
    "use strict";
    function run() {
        'use strict';
        var app = new MR.OBJViewer(document.getElementById('example'));
        // Init dat.gui and controls
        var elemFileInput = document.getElementById('fileUploadInput');
        var WWOBJLoader2Control = function () {
            this.smoothShading = app.smoothShading;
            this.doubleSide = app.doubleSide;
            this.streamMeshes = app.streamMeshes;
        };
        var wwObjLoader2Control = new WWOBJLoader2Control();
        var gui = new dat.GUI({
            autoPlace: false,
            width: 320
        });
        var menuDiv = document.getElementById('dat');
        menuDiv.appendChild(gui.domElement);
        var folderOptions = gui.addFolder('WWOBJLoader2 Options');
        var controlSmooth = folderOptions.add(wwObjLoader2Control, 'smoothShading').name('Smooth Shading');
        controlSmooth.onChange(function (value) {
            console.log('Setting smoothShading to: ' + value);
            app.alterSmoothShading();
        });
        var controlDouble = folderOptions.add(wwObjLoader2Control, 'doubleSide').name('Double Side Materials');
        controlDouble.onChange(function (value) {
            console.log('Setting doubleSide to: ' + value);
            app.alterDouble();
        });
        var controlStreamMeshes = folderOptions.add(wwObjLoader2Control, 'streamMeshes').name('Stream Meshes');
        controlStreamMeshes.onChange(function (value) {
            console.log('Setting streamMeshes to: ' + value);
            app.streamMeshes = value;
        });
        if (app.fileApiAvailable) {
            wwObjLoader2Control.pathTexture = 'obj/female02/';
            var controlPathTexture = folderOptions.add(wwObjLoader2Control, 'pathTexture').name('Relative path to textures');
            controlPathTexture.onChange(function (value) {
                console.log('Setting pathTexture to: ' + value);
                app.pathTexture = value + '/';
            });
            wwObjLoader2Control.loadObjFile = function () {
                elemFileInput.click();
            };
            folderOptions.add(wwObjLoader2Control, 'loadObjFile').name('Load OBJ/MTL Files');
            var handleFileSelect = function (object3d) {
                app._handleFileSelect(object3d, wwObjLoader2Control.pathTexture);
            };
            elemFileInput.addEventListener('change', handleFileSelect, false);
            wwObjLoader2Control.clearAllAssests = function () {
                app.clearAllAssests();
            };
            folderOptions.add(wwObjLoader2Control, 'clearAllAssests').name('Clear Scene');
        }
        folderOptions.open();
        // init three.js example application
        var resizeWindow = function () {
            app.resizeDisplayGL();
        };
        var render = function () {
            requestAnimationFrame(render);
            app.render();
        };
        window.addEventListener('resize', resizeWindow, false);
        console.log('Starting initialisation phase...');
        app.initGL();
        app.resizeDisplayGL();
        app.initPostGL();
        var prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile('male02', 'obj/male02/', 'male02.obj', 'obj/male02/', 'male02.mtl');
        app.loadFiles(prepData);
        // start render loop
        render();
    }
    MR.run = run;
})(MR || (MR = {}));
window.onload = MR.run;
// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
var MR;
(function (MR) {
    "use strict";
    var OBJViewer = (function () {
        function OBJViewer(elementToBindTo) {
            this.Validator = THREE.OBJLoader2.prototype._getValidator();
            this.renderer = null;
            this.canvas = elementToBindTo;
            this.aspectRatio = 1;
            this.recalcAspectRatio();
            this.scene = null;
            this.cameraDefaults = {
                // Baseline : near = 0.1, far =10000
                position: new THREE.Vector3(0.0, 175.0, 500.0),
                target: new THREE.Vector3(0, 0, 0),
                near: 100,
                far: 300,
                fov: 45
            };
            this.camera = null;
            this.cameraTarget = this.cameraDefaults.target;
            this.controls = null;
            this.smoothShading = true;
            this.doubleSide = false;
            this.streamMeshes = true;
            this.cube = null;
            this.pivot = null;
            this.wwObjLoader2 = new THREE.OBJLoader2.WWOBJLoader2();
            this.wwObjLoader2.setCrossOrigin('anonymous');
            // Check for the various File API support.
            this.fileApiAvailable = true;
            if (File && FileReader && FileList && Blob) {
                console.log('File API is supported! Enabling all features.');
            }
            else {
                this.fileApiAvailable = false;
                console.warn('File API is not supported! Disabling file loading.');
            }
        }
        OBJViewer.prototype.initGL = function () {
            var scope = this;
            this.renderer = new THREE.WebGLRenderer({
                logarithmicDepthBuffer: false,
                canvas: this.canvas,
                antialias: true,
                autoClear: true
            });
            this.renderer.setClearColor(0x050505);
            this.renderer.setClearColor(0xf0f0f0);
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
            var helper = new THREE.GridHelper(1200, 60, 0x86e6ff, 0x999999);
            this.scene.add(helper);
            var geometry = new THREE.BoxGeometry(10, 10, 10);
            var material = new THREE.MeshNormalMaterial();
            this.cube = new THREE.Mesh(geometry, material);
            this.cube.position.set(0, 0, 0);
            this.scene.add(this.cube);
            var loader = new THREE.OBJLoader();
                scope.scene.add(object);
            });
            this.createPivot();
        };
        ;
        OBJViewer.prototype.createPivot = function () {
            this.pivot = new THREE.Object3D();
            this.pivot.name = 'Pivot';
            this.scene.add(this.pivot);
        };
        ;
        OBJViewer.prototype.initPostGL = function () {
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
                var meshParameters;
                var depthMaterial = new THREE.MeshDepthMaterial();
                return new THREE.OBJLoader2.WWOBJLoader2.LoadedMeshUserOverride(false, null, depthMaterial);
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
        ;
        OBJViewer.prototype.loadFiles = function (prepData) {
            prepData.setSceneGraphBaseNode(this.pivot);
            prepData.setStreamMeshes(this.streamMeshes);
            this.wwObjLoader2.prepareRun(prepData);
            this.wwObjLoader2.run();
        };
        ;
        OBJViewer.prototype._handleFileSelect = function (event, pathTexture) {
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
                var eventTarget = fileDataObj.target;
                var uint8Array = new Uint8Array(eventTarget.result);
                if (fileMtl === null) {
                    scope.loadFilesUser({
                        name: 'userObj',
                        objAsArrayBuffer: uint8Array,
                        pathTexture: pathTexture,
                        mtlAsString: null
                    });
                }
                else {
                    fileReader.onload = function (fileDataMtl) {
                        var eventTarget = fileDataMtl.target;
                        scope.loadFilesUser({
                            name: 'userObj',
                            objAsArrayBuffer: uint8Array,
                            pathTexture: pathTexture,
                            mtlAsString: eventTarget.result
                        });
                    };
                    fileReader.readAsText(fileMtl);
                }
            };
            fileReader.readAsArrayBuffer(fileObj);
        };
        ;
        OBJViewer.prototype.loadFilesUser = function (objDef) {
            var prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataArrayBuffer(objDef.name, objDef.objAsArrayBuffer, objDef.pathTexture, objDef.mtlAsString);
            prepData.setSceneGraphBaseNode(this.pivot);
            prepData.setStreamMeshes(this.streamMeshes);
            this.wwObjLoader2.prepareRun(prepData);
            this.wwObjLoader2.run();
        };
        ;
        OBJViewer.prototype.resizeDisplayGL = function () {
            this.controls.handleResize();
            this.recalcAspectRatio();
            this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight, false);
            this.updateCamera();
        };
        ;
        OBJViewer.prototype.recalcAspectRatio = function () {
            this.aspectRatio = (this.canvas.offsetHeight === 0) ? 1 : this.canvas.offsetWidth / this.canvas.offsetHeight;
        };
        ;
        OBJViewer.prototype.resetCamera = function () {
            this.camera.position.copy(this.cameraDefaults.position);
            this.cameraTarget.copy(this.cameraDefaults.target);
            this.updateCamera();
        };
        ;
        OBJViewer.prototype.updateCamera = function () {
            this.camera.aspect = this.aspectRatio;
            this.camera.lookAt(this.cameraTarget);
            this.camera.updateProjectionMatrix();
        };
        ;
        OBJViewer.prototype.render = function () {
            if (!this.renderer.autoClear)
                this.renderer.clear();
            this.controls.update();
            this.cube.rotation.x += 0.05;
            this.cube.rotation.y += 0.05;
            this.renderer.render(this.scene, this.camera);
        };
        ;
        OBJViewer.prototype.alterSmoothShading = function () {
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
        ;
        OBJViewer.prototype.alterDouble = function () {
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
        ;
        OBJViewer.prototype.traverseScene = function (object3d) {
            if (object3d.material instanceof THREE.MultiMaterial) {
                var materials = object3d.material.materials;
                for (var name in materials) {
                    if (materials.hasOwnProperty(name))
                        this.traversalFunction(materials[name]);
                }
            }
            else if (object3d.material) {
                this.traversalFunction(object3d.material);
            }
        };
        ;
        OBJViewer.prototype.clearAllAssests = function () {
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
                            if (materials.hasOwnProperty(name))
                                materials[name].dispose();
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
        ;
        return OBJViewer;
    }());
    MR.OBJViewer = OBJViewer;
})(MR || (MR = {}));
//# sourceMappingURL=modelrelief.js.map