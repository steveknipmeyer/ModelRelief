// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE               from 'three'

import {TrackballControls}      from 'TrackballControls'
import {Graphics}               from 'Graphics'
import {Logger}                 from 'Logger'
import {Materials}              from 'Materials'
import {Services}               from 'Services'

interface CameraDefaults {
    position:   THREE.Vector3;        // location of camera
    target:     THREE.Vector3;        // target point
    near:       number;               // near clipping plane
    far:        number;               // far clipping plane
    fov:        number;               // field of view
}

const ObjectNames = {
    Root :  'Root',
    Grid :  'Grid'
}

/**
 * @exports Viewer/Viewer
 */
export class Viewer {
   
    renderer:       THREE.WebGLRenderer;
    canvas:         HTMLCanvasElement;
    aspectRatio:    number;

    scene:          THREE.Scene;
    root:           THREE.Object3D; 

    camera:         THREE.PerspectiveCamera;
    cameraDefaults: CameraDefaults;
    cameraTarget:   THREE.Vector3;

    controls :      TrackballControls;
    logger   :      Logger;

    /**
     * Default constructor
     * @class Viewer
     * @constructor
     * @param elementToBindTo HTML element to host the viewer.
     */
    constructor(elementToBindTo: HTMLCanvasElement) {
                    
        this.logger = Services.consoleLogger;

        this.renderer = null;
        this.canvas = elementToBindTo;
        this.aspectRatio = 1;
        this.recalcAspectRatio();

        this.scene = null;
        this.root  = null;

        this.controls = null;

        this.initializeScene();

        this.initializeGL();

        // start render loop
        this.render();
    }
    
    /**
     * Adds lighting to the scene
     */
    initializeLighting() {

        let ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);

        let directionalLight1 = new THREE.DirectionalLight(0xC0C090);
        directionalLight1.position.set(-100, -50, 100);
        this.scene.add(directionalLight1);

        let directionalLight2 = new THREE.DirectionalLight(0xC0C090);
        directionalLight2.position.set(100, 50, -100);
        this.scene.add(directionalLight2);
    }

    /**
     * Initialize the viewer camera
     */
    initializeCamera() {

        this.cameraDefaults = {
            // Baseline : near = 0.1, far = 10000
            // ZBuffer  : near = 100, far = 300
            position:       new THREE.Vector3(0.0, 175.0, 500.0),
            target:         new THREE.Vector3(0, 0, 0),
            near:           0.1,
            far:            10000,
            fov:            45
        };

        this.camera = null;
        this.cameraTarget = this.cameraDefaults.target;

        this.camera = new THREE.PerspectiveCamera(this.cameraDefaults.fov, this.aspectRatio, this.cameraDefaults.near, this.cameraDefaults.far);
        this.resetCamera();
    }

    /**
     * Initialize the scene with the base objects
     */
    initializeScene () {

        this.scene = new THREE.Scene();
        this.createRoot();

        var helper = new THREE.GridHelper(300, 30, 0x86e6ff, 0x999999);
        helper.name = ObjectNames.Grid;
        this.scene.add(helper);
    }

    /**
     * Initialize the WebGL settings
     */
    initializeGL() {

        this.renderer = new THREE.WebGLRenderer({
            logarithmicDepthBuffer: false,
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.autoClear = true;
        this.renderer.setClearColor(0x000000);


        this.initializeCamera();
        this.initializeLighting();
        this.initializeInputControls();

        this.resizeDisplayGL();  
        window.addEventListener('resize', this.resizeWindow.bind(this), false);
    }

    /**
     * Handles a window resize event
     */
    resizeWindow () {

        this.resizeDisplayGL();
    }

    /**
     * Creates the root object in the scene
     */
    createRoot() {

        this.root = new THREE.Object3D();
        this.root.name = ObjectNames.Root;
        this.scene.add(this.root);
    }

    /**
     * Handles the WebGL processing for a DOM window 'resize' event
     */
    resizeDisplayGL() {

        this.controls.handleResize();
        this.recalcAspectRatio();
        this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight, false);
        this.updateCamera();
    }

    /**
     * Calculates the aspect ratio of the canvas afer a window resize
     */
    recalcAspectRatio() {

        this.aspectRatio = (this.canvas.offsetHeight === 0) ? 1 : this.canvas.offsetWidth / this.canvas.offsetHeight;
    } 

    /**
     * Resets all camera properties to the defaults
     */
    resetCamera() {

        this.camera.position.copy(this.cameraDefaults.position);
        this.cameraTarget.copy(this.cameraDefaults.target);
        this.updateCamera();
    }

    /**
     * Updates the scene camera to match the new window size
     */
    updateCamera() {

        this.camera.aspect = this.aspectRatio;
        this.camera.lookAt(this.cameraTarget);
        this.camera.updateProjectionMatrix();
    }

    /**
     * Performs the WebGL render of the scene
     */
    renderGL() {

        if (!this.renderer.autoClear) 
            this.renderer.clear();

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Main DOM render loop
     */
    render() {

        requestAnimationFrame(this.render.bind(this));
        this.renderGL();
    }

    /**
     * Sets up the user input controls (Trackball)
     */
    initializeInputControls() {

        this.controls = new TrackballControls(this.camera, this.renderer.domElement);
    }

    /**
     * Removes all scene objects
     */
    clearAllAssests() {
        
        Graphics.removeSceneObjectChildren(this.scene, this.root, false);
        this.createRoot();
    } 

    /**
     * Display the reference grid.
     */
    displayGrid(visible : boolean) {

        let gridGeometry : THREE.Object3D = this.scene.getObjectByName(ObjectNames.Grid);
        gridGeometry.visible = visible;
        this.logger.addInfoMessage(`Display grid = ${visible}`);
    } 
} 

