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

    static DefaultResolution : number           = 1024;     // default MPV resolution

    _width           : number                   = MeshPreviewViewer.DefaultResolution;  
    _height          : number                   = MeshPreviewViewer.DefaultResolution;  

    previewCanvas       : HTMLCanvasElement;
    previewRenderer     : THREE.WebGLRenderer;
    previewCamera       : THREE.PerspectiveCamera;
    previewControls     : TrackballControls;
    previewScene        : THREE.Scene;
    previewModel        : THREE.Group;
    previewMaterial     : THREE.ShaderMaterial;

    logger              : Logger;

    CameraButtonId      : string = 'camera';

    cameraZPosition     : number = 4
    cameraNearPlane     : number = 2;
    cameraFarPlane      : number = 10.0;
    fieldOfView         : number = 37;              // https://www.nikonians.org/reviews/fov-tables
    
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

        this.previewCanvas = this.initializeCanvas('previewCanvas', this._width, this._height);
        this.previewRenderer = new THREE.WebGLRenderer( {canvas : this.previewCanvas});
        this.previewRenderer.setPixelRatio(window.devicePixelRatio);
        this.previewRenderer.setSize(this._width, this._height);

        this.previewCamera = new THREE.PerspectiveCamera(this.fieldOfView, this._width / this._height, this.cameraNearPlane, this.cameraFarPlane);
        this.previewCamera.position.z = this.cameraZPosition;

        this.previewControls = new TrackballControls(this.previewCamera, this.previewRenderer.domElement);

        this.setupPreviewScene();

        this.initializeLighting(this.previewScene);
    }

    /**
     * Initialize the application.
     */
    initialize() {
    
        this.logger = Services.htmlLogger;       

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

        this.updateViewOnWindowResize(this.previewRenderer,  this._width, this._height,  this.previewCamera);
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
    
        this.previewScene = new THREE.Scene();
        this.previewModel = new THREE.Group();
        this.previewScene.add(this.previewModel);
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

        requestAnimationFrame(this.animate);

        this.previewControls.update();

        this.previewRenderer.render(this.previewScene, this.previewCamera); 
    }
}