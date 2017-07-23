// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";
var MR;
(function (MR) {
    var Dummy = (function () {
        function Dummy() {
            var prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile();
        }
        return Dummy;
    }());
    function main() {
        console.log('ModelRelief started');
        var viewer = new MR.Viewer(document.getElementById('model3D'));
        var modelNameElement = window.document.getElementById('modelName');
        var modelPathElement = window.document.getElementById('modelPath');
        var modelName = modelNameElement.textContent;
        var modelPath = modelPathElement.textContent;
        var fileName = modelName;
        var texturePath = modelPath;
        var materialFile = modelName.replace(/\.[^/.]+$/, "") + '.mtl';
        var prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile(modelName, modelPath, fileName, texturePath, materialFile);
        var loader = new MR.OBJLoader(viewer.pivot);
        loader.loadFiles(prepData);
    }
    MR.main = main;
})(MR || (MR = {}));
// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";
var MR;
(function (MR) {
    var OBJLoader = (function () {
        function OBJLoader(pivot) {
            var scope = this;
            this.pivot = pivot;
            this.loader = new THREE.OBJLoader2.WWOBJLoader2();
            this.loader.setCrossOrigin('anonymous');
            this.loader.registerCallbackProgress(this.reportProgress.bind(scope));
            this.loader.registerCallbackCompletedLoading(this.completedLoading.bind(scope));
            this.loader.registerCallbackMaterialsLoaded(this.materialsLoaded.bind(scope));
            this.loader.registerCallbackMeshLoaded(this.meshLoaded.bind(scope));
            this.validator = THREE.OBJLoader2.prototype._getValidator();
        }
        OBJLoader.prototype.reportProgress = function (content) {
            console.log('Progress: ' + content);
        };
        ;
        OBJLoader.prototype.materialsLoaded = function (materials) {
            var count = this.validator.isValid(materials) ? materials.length : 0;
            console.log('Loaded #' + count + ' materials.');
        };
        ;
        OBJLoader.prototype.meshLoaded = function (name, bufferGeometry, material) {
            console.log('Loaded mesh: ' + name + ' Material name: ' + material.name);
            /*
                        let meshParameters : THREE.MeshDepthMaterialParameters;
                        let depthMaterial = new THREE.MeshDepthMaterial();
                        return new THREE.OBJLoader2.WWOBJLoader2.LoadedMeshUserOverride (false, null, depthMaterial);
            */
            return new THREE.OBJLoader2.WWOBJLoader2.LoadedMeshUserOverride(false, null, new THREE.MeshPhongMaterial());
        };
        ;
        OBJLoader.prototype.completedLoading = function () {
            console.log('Loading complete!');
        };
        ;
        OBJLoader.prototype.loadFiles = function (prepData) {
            prepData.setSceneGraphBaseNode(this.pivot);
            prepData.setStreamMeshes(true);
            this.loader.prepareRun(prepData);
            this.loader.run();
        };
        ;
        return OBJLoader;
    }());
    MR.OBJLoader = OBJLoader;
})(MR || (MR = {}));
// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";
var MR;
(function (MR) {
    var Viewer = (function () {
        function Viewer(elementToBindTo) {
            var scope = this;
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
            this.pivot = null;
            this.initializeViewerControls();
            this.initGL();
            this.resizeDisplayGL();
            window.addEventListener('resize', this.resizeWindow.bind(this), false);
            // start render loop
            this.render();
        }
        Viewer.prototype.initGL = function () {
            var scope = this;
            this.renderer = new THREE.WebGLRenderer({
                logarithmicDepthBuffer: false,
                canvas: this.canvas,
                antialias: true,
            });
            this.renderer.autoClear = true;
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
        ;
        Viewer.prototype.resizeWindow = function () {
            this.resizeDisplayGL();
        };
        ;
        Viewer.prototype.createPivot = function () {
            this.pivot = new THREE.Object3D();
            this.pivot.name = 'Pivot';
            this.scene.add(this.pivot);
        };
        ;
        Viewer.prototype.resizeDisplayGL = function () {
            this.controls.handleResize();
            this.recalcAspectRatio();
            this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight, false);
            this.updateCamera();
        };
        ;
        Viewer.prototype.recalcAspectRatio = function () {
            this.aspectRatio = (this.canvas.offsetHeight === 0) ? 1 : this.canvas.offsetWidth / this.canvas.offsetHeight;
        };
        ;
        Viewer.prototype.resetCamera = function () {
            this.camera.position.copy(this.cameraDefaults.position);
            this.cameraTarget.copy(this.cameraDefaults.target);
            this.updateCamera();
        };
        ;
        Viewer.prototype.updateCamera = function () {
            this.camera.aspect = this.aspectRatio;
            this.camera.lookAt(this.cameraTarget);
            this.camera.updateProjectionMatrix();
        };
        ;
        Viewer.prototype.renderGL = function () {
            if (!this.renderer.autoClear)
                this.renderer.clear();
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        ;
        Viewer.prototype.render = function () {
            requestAnimationFrame((this.render).bind(this));
            this.renderGL();
        };
        ;
        Viewer.prototype.clearAllAssests = function () {
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
        Viewer.prototype.initializeViewerControls = function () {
            var ViewerControls = (function () {
                function ViewerControls() {
                    this.displayGrid = true;
                }
                ;
                return ViewerControls;
            }());
            var viewerControls = new ViewerControls();
            // Init dat.gui and controls for the UI
            var gui = new dat.GUI({
                autoPlace: false,
                width: 320
            });
            var menuDiv = document.getElementById('dat');
            menuDiv.appendChild(gui.domElement);
            var folderOptions = gui.addFolder('ModelViewer Options');
            var controlDisplayGrid = folderOptions.add(viewerControls, 'displayGrid').name('Display Grid');
            controlDisplayGrid.onChange = (function (value) {
                console.log('Setting displayGrid to: ' + value);
            });
            folderOptions.open();
        };
        return Viewer;
    }());
    MR.Viewer = Viewer;
})(MR || (MR = {}));
//# sourceMappingURL=modelrelief.js.map