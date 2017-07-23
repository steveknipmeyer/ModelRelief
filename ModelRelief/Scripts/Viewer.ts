// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

"use strict";
namespace MR {

    interface CameraDefaults {
        position: THREE.Vector3;        // location of camera
        target: THREE.Vector3;        // target point
        near: number;               // near clipping plane
        far: number;               // far clipping plane
        fov: number;               // field of view
    }
    export class Viewer {

        public pivot: THREE.Object3D;

        renderer: THREE.WebGLRenderer;
        canvas: HTMLCanvasElement;
        aspectRatio: number;

        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        cameraDefaults: CameraDefaults;
        cameraTarget: THREE.Vector3;
        controls: THREE.TrackballControls;

        constructor(elementToBindTo: HTMLCanvasElement) {
            let scope = this;

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

            let resizeWindow = function () {
                scope.resizeDisplayGL();
            };
            let render = function () {
                requestAnimationFrame(render);
                scope.renderGL();
            };
            window.addEventListener('resize', resizeWindow, false);
            console.log('Starting initialization phase...');

            this.initGL();
            this.resizeDisplayGL();

            // start render loop
            render();
        }

        initGL() {
            let scope = this;

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

        createPivot() {
            this.pivot = new THREE.Object3D();
            this.pivot.name = 'Pivot';
            this.scene.add(this.pivot);
        };

        resizeDisplayGL() {
            this.controls.handleResize();
            this.recalcAspectRatio();
            this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight, false);
            this.updateCamera();
        };

        recalcAspectRatio() {
            this.aspectRatio = (this.canvas.offsetHeight === 0) ? 1 : this.canvas.offsetWidth / this.canvas.offsetHeight;
        };

        resetCamera() {
            this.camera.position.copy(this.cameraDefaults.position);
            this.cameraTarget.copy(this.cameraDefaults.target);
            this.updateCamera();
        };

        updateCamera() {
            this.camera.aspect = this.aspectRatio;
            this.camera.lookAt(this.cameraTarget);
            this.camera.updateProjectionMatrix();
        };

        renderGL() {
            if (!this.renderer.autoClear) this.renderer.clear();

            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };

        clearAllAssests() {
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

        initializeViewerControls() {
            class ViewerControls {
                displayGrid: boolean;

                constructor() {
                    this.displayGrid = true;
                };
            }
            let viewerControls = new ViewerControls();

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
        }
    }
}