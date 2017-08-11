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

    static DefaultResolution : number       = 512;     // default MPV resolution

    _width       : number                   = MeshPreviewViewer.DefaultResolution;  
    _height      : number                   = MeshPreviewViewer.DefaultResolution;  

    _canvas       : HTMLCanvasElement;
    _renderer     : THREE.WebGLRenderer;
    _camera       : THREE.PerspectiveCamera;
    _controls     : TrackballControls;

    scene         : THREE.Scene;
    root          : THREE.Group;

    _logger        : Logger;
    
    _cameraZPosition     : number = 4
    _cameraNearPlane     : number = 2;
    _cameraFarPlane      : number = 10.0;
    _fieldOfView         : number = 37;              // https://www.nikonians.org/reviews/fov-tables
    
    /**
     * @constructor
     */
    constructor() {

        this.initialize()
        this.animate();
    }

    /**
     * Initializes the preview renderer used to view the 3D mesh.
     */
    initializePreviewRenderer() {

        this._canvas = this.initializeCanvas('previewCanvas', this._width, this._height);
        this._renderer = new THREE.WebGLRenderer( {canvas : this._canvas});
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(this._width, this._height);

        this._camera = new THREE.PerspectiveCamera(this._fieldOfView, this._width / this._height, this._cameraNearPlane, this._cameraFarPlane);
        this._camera.position.z = this._cameraZPosition;

        this._controls = new TrackballControls(this._camera, this._renderer.domElement);

        this.setupPreviewScene();

        this.initializeLighting(this.scene);
    }

    /**
     * Initialize the application.
     */
    initialize() {
    
        this._logger = Services.htmlLogger;       

        this.initializePreviewRenderer();

        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize, false);
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
    setupPreviewScene() {
    
        this.scene = new THREE.Scene();
        this.root = new THREE.Group();
        this.scene.add(this.root);
    }

    /**
     * Constructs a WebGL target canvas.
     * @param id DOM id for canvas.
     * @param resolution Resolution (square) for canvas.
     */
    initializeCanvas(id : string, width : number, height : number) : HTMLCanvasElement {
    
        let canvas : HTMLCanvasElement = <HTMLCanvasElement> document.querySelector(`#${id}`);
        if (!canvas)
            {
            console.error(`Canvas element id = ${id} not found`);
            return null;
            }

        // render dimensions    
        canvas.width  = width;
        canvas.height = height;

        // DOM element dimensions (may be different than render dimensions)
        canvas.style.width  = `${width}px`;
        canvas.style.height = `${height}px`;

        return canvas;
    }

    /**
     * Animation loop.
     */
    animate() {

        requestAnimationFrame(this.animate.bind(this));

        this._controls.update();

        this._renderer.render(this.scene, this._camera); 
    }
}