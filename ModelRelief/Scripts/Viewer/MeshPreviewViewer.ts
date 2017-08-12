// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE               from 'three'

import {Graphics}               from 'Graphics'
import {Logger, HTMLLogger}     from 'Logger'
import {MathLibrary}            from 'Math'
import {Services}               from 'Services'
import {TrackballControls}      from 'TrackballControls'

/**
 * @class
 * MeshViewer
 */
export class MeshPreviewViewer {

    _scene              : THREE.Scene               = null;;
    _root               : THREE.Group               = null;

    _canvas             : HTMLCanvasElement         = null;
    _width              : number                    = 0;
    _height             : number                    = 0;

    _renderer           : THREE.WebGLRenderer       = null;;
    _camera             : THREE.PerspectiveCamera   = null;
    _controls           : TrackballControls         = null;
    
    _cameraZPosition    : number                    = 4
    _cameraNearPlane    : number                    = 2;
    _cameraFarPlane     : number                    = 10.0;
    _fieldOfView        : number                    = 37;                                   // https://www.nikonians.org/reviews/fov-tables

    _logger             : Logger                    = null;
    
    /**
     * @constructor
     */
    constructor(previewCanvasId : string) {

        this._canvas = Graphics.initializeCanvas(previewCanvasId);
        this._width  = this._canvas.offsetWidth;
        this._height = this._canvas.offsetHeight;

        this.initialize()
        this.animate();
    }

//#region Properties
    set model(value : THREE.Mesh) {

        Graphics.removeSceneObjectChildren(this._scene, this._root, false);
        this._root.add(value);
    }

//#endregion

    /**
     * Initializes the preview renderer used to view the 3D mesh.
     */
    initializeRenderer() {

        this._renderer = new THREE.WebGLRenderer( {canvas : this._canvas});
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(this._width, this._height);

        this._camera = new THREE.PerspectiveCamera(this._fieldOfView, this._width / this._height, this._cameraNearPlane, this._cameraFarPlane);
        this._camera.position.z = this._cameraZPosition;

        this._controls = new TrackballControls(this._camera, this._renderer.domElement);

        this.setupScene();

        this.initializeLighting(this._scene);
    }

    /**
     * Initialize the application.
     */
    initialize() {
    
        this._logger = Services.htmlLogger;       

        this.initializeRenderer();

        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    /**
     * Updates a renderer properties.
     * Event handler called on window resize.
     * @param renderer Renderer to update.
     * @param width Width of the renderer.
     * @param height Height of the renderer.
     * @param camera Renderer's camera.
     */
    updateViewOnWindowResize(renderer : THREE.Renderer, width : number, height : number, camera? : THREE.PerspectiveCamera) {

        let aspect : number = width / height;
        if (camera) {
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
        }
        renderer.setSize(width, height);
    }

    /**
     * Event handler called on window resize.
     */
    onWindowResize() {

        this.updateViewOnWindowResize(this._renderer,  this._width, this._height,  this._camera);
    }

    /**
     * Adds lighting to the scene.
     * param theScene Scene to add lighting.
     */
    initializeLighting(theScene : THREE.Scene) {

        let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        theScene.add(ambientLight);

        let directionalLight1 = new THREE.DirectionalLight(0xffffff);
        directionalLight1.position.set(4, 4, 4);
        theScene.add(directionalLight1);
    }

     /**
      * Adds helpers to the scene to visualize camera, coordinates, etc. 
      * @param scene Scene to annotate.
      * @param camera Camera to construct helper (may be null).
      * @param addAxisHelper Add a helper for the cartesian axes.
      */
    initializeModelHelpers(scene : THREE.Scene, camera : THREE.Camera, addAxisHelper : boolean) {

        if (camera) {
            let cameraHelper = new THREE.CameraHelper(camera );
            cameraHelper.visible = true;
            scene.add(cameraHelper);
        }

        if (addAxisHelper) {
            let axisHelper = new THREE.AxisHelper(2);
            axisHelper.visible = true;
            scene.add(axisHelper);
        }
    }

    /**
     * Constructs the scene used to visualize the 3D mesh.
     */
    setupScene() {
    
        this._scene = new THREE.Scene();
        this._root = new THREE.Group();
        this._scene.add(this._root);
    }

    /**
     * Animation loop.
     */
    animate() {

        requestAnimationFrame(this.animate.bind(this));

        this._controls.update();

        this._renderer.render(this._scene, this._camera); 
    }
}