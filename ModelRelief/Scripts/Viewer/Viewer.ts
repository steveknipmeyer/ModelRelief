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
   
    root            : THREE.Object3D               = null;      

    _renderer        : THREE.WebGLRenderer         = null;;
    _canvas          : HTMLCanvasElement           = null;
    _aspectRatio     : number                      = 1.0;

    _scene           : THREE.Scene                 = null;

    _camera          : THREE.PerspectiveCamera     = null;
    _cameraDefaults  : CameraDefaults              = null;;
    _cameraTarget    : THREE.Vector3               = null;;

    _controls        : TrackballControls           = null;
    _logger          : Logger                      = null;

    /**
     * Default constructor
     * @class Viewer
     * @constructor
     * @param elementToBindTo HTML element to host the viewer.
     */
    constructor(modelCanvasId : string) {
                    
        this._logger = Services.consoleLogger;

        this._canvas         = <HTMLCanvasElement> document.getElementById(modelCanvasId);
        this.recalcAspectRatio();

        this.initializeScene();

        this.initializeGL();

        this.render();
    }
    
    /**
     * Adds lighting to the scene
     */
    initializeLighting() {

        let ambientLight = new THREE.AmbientLight(0x404040);
        this._scene.add(ambientLight);

        let directionalLight1 = new THREE.DirectionalLight(0xC0C090);
        directionalLight1.position.set(-100, -50, 100);
        this._scene.add(directionalLight1);

        let directionalLight2 = new THREE.DirectionalLight(0xC0C090);
        directionalLight2.position.set(100, 50, -100);
        this._scene.add(directionalLight2);
    }

    /**
     * Initialize the viewer camera
     */
    initializeCamera() {

        this._cameraDefaults = {
            // Baseline : near = 0.1, far = 10000
            // ZBuffer  : near = 100, far = 300
            position:       new THREE.Vector3(0.0, 175.0, 500.0),
            target:         new THREE.Vector3(0, 0, 0),
            near:           0.1,
            far:            10000,
            fov:            45
        };

        this._camera = null;
        this._cameraTarget = this._cameraDefaults.target;

        this._camera = new THREE.PerspectiveCamera(this._cameraDefaults.fov, this._aspectRatio, this._cameraDefaults.near, this._cameraDefaults.far);
        this.resetCamera();
    }

    /**
     * Initialize the scene with the base objects
     */
    initializeScene () {

        this._scene = new THREE.Scene();
        this.createRoot();

        var helper = new THREE.GridHelper(300, 30, 0x86e6ff, 0x999999);
        helper.name = ObjectNames.Grid;
        this._scene.add(helper);
    }

    /**
     * Initialize the WebGL settings
     */
    initializeGL() {

        this._renderer = new THREE.WebGLRenderer({
            logarithmicDepthBuffer: false,
            canvas: this._canvas,
            antialias: true
        });
        this._renderer.autoClear = true;
        this._renderer.setClearColor(0x000000);


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
        this._scene.add(this.root);
    }

    /**
     * Handles the WebGL processing for a DOM window 'resize' event
     */
    resizeDisplayGL() {

        this._controls.handleResize();
        this.recalcAspectRatio();
        this._renderer.setSize(this._canvas.offsetWidth, this._canvas.offsetHeight, false);
        this.updateCamera();
    }

    /**
     * Calculates the aspect ratio of the canvas afer a window resize
     */
    recalcAspectRatio() {

        this._aspectRatio = (this._canvas.offsetHeight === 0) ? 1 : this._canvas.offsetWidth / this._canvas.offsetHeight;
    } 

    /**
     * Resets all camera properties to the defaults
     */
    resetCamera() {

        this._camera.position.copy(this._cameraDefaults.position);
        this._cameraTarget.copy(this._cameraDefaults.target);
        this.updateCamera();
    }

    /**
     * Updates the scene camera to match the new window size
     */
    updateCamera() {

        this._camera.aspect = this._aspectRatio;
        this._camera.lookAt(this._cameraTarget);
        this._camera.updateProjectionMatrix();
    }

    /**
     * Performs the WebGL render of the scene
     */
    renderGL() {

        if (!this._renderer.autoClear) 
            this._renderer.clear();

        this._controls.update();
        this._renderer.render(this._scene, this._camera);
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

        this._controls = new TrackballControls(this._camera, this._renderer.domElement);
    }

    /**
     * Removes all scene objects
     */
    clearAllAssests() {
        
        Graphics.removeSceneObjectChildren(this._scene, this.root, false);
        this.createRoot();
    } 

    /**
     * Display the reference grid.
     */
    displayGrid(visible : boolean) {

        let gridGeometry : THREE.Object3D = this._scene.getObjectByName(ObjectNames.Grid);
        gridGeometry.visible = visible;
        this._logger.addInfoMessage(`Display grid = ${visible}`);
    } 
} 

