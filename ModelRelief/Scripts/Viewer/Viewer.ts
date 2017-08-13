// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                   from 'three'

import {TrackballControls}          from 'TrackballControls'
import {CameraSettings, Graphics}   from 'Graphics'
import {Logger}                     from 'Logger'
import {Materials}                  from 'Materials'
import {Services}                   from 'Services'

const ObjectNames = {
    Root :  'Root',
    Grid :  'Grid'
}

/**
 * @exports Viewer/Viewer
 */
export class Viewer {

    _scene                  : THREE.Scene               = null;
    _root                   : THREE.Object3D            = null;      
                                                        
    _renderer               : THREE.WebGLRenderer       = null;;
    _canvas                 : HTMLCanvasElement         = null;
    _width                  : number                    = 0;
    _height                 : number                    = 0;

    _camera                 : THREE.PerspectiveCamera   = null;
    _defaultCameraSettings  : CameraSettings            = null;

    _controls               : TrackballControls         = null;

    _logger                 : Logger                    = null;

    /**
     * Default constructor
     * @class Viewer
     * @constructor
     * @param elementToBindTo HTML element to host the viewer.
     */
    constructor(modelCanvasId : string) {
                    
        this._logger = Services.consoleLogger;

        this._canvas = Graphics.initializeCanvas(modelCanvasId);
        this._width  = this._canvas.offsetWidth;
        this._height = this._canvas.offsetHeight;

        let useTestCamera = true;
        this.initialize(useTestCamera);

        this.animate();
    }

//#region Properties
    /**
     * Sets the active model.
     * @param value New model to activate.
     */
    set model(value : THREE.Group) {

        Graphics.removeSceneObjectChildren(this._scene, this._root, false);
        this._root.add(value);
    }

    /**
     * Gets the camera.
     */
    get camera() {

        return this._camera;
    }

    /**
     * Calculates the aspect ratio of the canvas afer a window resize
     */
    get aspectRatio() : number {

        let aspectRatio : number = this._width / this._height;
        return aspectRatio;
    } 

//#endregion

//#region Initialization    
    /**
     * Initialize Scene
     */
    initializeScene () {

        this._scene = new THREE.Scene();
        this.createRoot();

        var helper = new THREE.GridHelper(300, 30, 0x86e6ff, 0x999999);
        helper.name = ObjectNames.Grid;
        this._scene.add(helper);
    }

    /**
     * Initialize the WebGL renderer.
     */
    initializeRenderer () {

        this._renderer = new THREE.WebGLRenderer({

            logarithmicDepthBuffer  : false,
            canvas                  : this._canvas,
            antialias               : true
        });
        this._renderer.autoClear = true;
        this._renderer.setClearColor(0x000000);
    }

    /**
     * Initialize the viewer camera
     */
    initializeCamera(useTestCamera : boolean) {

        let settingsOBJ : CameraSettings = {
            // Baseline : near = 0.1, far = 10000
            // ZBuffer  : near = 100, far = 300

            position:       new THREE.Vector3(0.0, 175.0, 500.0),
            target:         new THREE.Vector3(0, 0, 0),
            near:           0.1,
            far:            10000,
            fieldOfView:    45
        };

        let settingsTestModels : CameraSettings = {

            position:       new THREE.Vector3(0.0, 0.0, 4.0),
            target:         new THREE.Vector3(0, 0, 0),
            near:           2.0,
            far:            10.0,
            fieldOfView:    37                                  // https://www.nikonians.org/reviews/fov-tables
        };

        this._defaultCameraSettings = useTestCamera ? settingsTestModels : settingsOBJ;    

        this._camera = new THREE.PerspectiveCamera(this._defaultCameraSettings.fieldOfView, this.aspectRatio, this._defaultCameraSettings.near, this._defaultCameraSettings.far);
        this._camera.position.copy(this._defaultCameraSettings.position);

        this.resetCamera();
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
     * Sets up the user input controls (Trackball)
     */
    initializeInputControls() {

        this._controls = new TrackballControls(this.camera, this._renderer.domElement);
    }

    /**
     * Initialize the scene with the base objects
     */
    initialize (useTestCamera : boolean) {

        this.initializeScene();
        this.initializeRenderer();
        this.initializeCamera(useTestCamera);
        this.initializeLighting();
        this.initializeInputControls();

        this.onResizeWindow();
        window.addEventListener('resize', this.onResizeWindow.bind(this), false);
    }
//#endregion

//#region Scene
    /**
     * Removes all scene objects
     */
    clearAllAssests() {
        
        Graphics.removeSceneObjectChildren(this._scene, this._root, false);
        this.createRoot();
    } 

    /**
     * Creates the root object in the scene
     */
    createRoot() {

        this._root = new THREE.Object3D();
        this._root.name = ObjectNames.Root;
        this._scene.add(this._root);
    }

    /**
     * Display the reference grid.
     */
    displayGrid(visible : boolean) {

        let gridGeometry : THREE.Object3D = this._scene.getObjectByName(ObjectNames.Grid);
        gridGeometry.visible = visible;
        this._logger.addInfoMessage(`Display grid = ${visible}`);
    } 
//#endregion

//#region Camera
    /**
     * Resets all camera properties to the defaults
     */
    resetCamera() {

        this.camera.position.copy(this._defaultCameraSettings.position);
        this.updateCamera();
    }
//#endregion

//#region Window Resize
    /**
     * Updates the scene camera to match the new window size
     */
    updateCamera() {

        this.camera.aspect = this.aspectRatio;
        this.camera.lookAt(this._defaultCameraSettings.target);
        this.camera.updateProjectionMatrix();
    }

    /**
     * Handles the WebGL processing for a DOM window 'resize' event
     */
    resizeDisplayWebGL() {

        this._width =  this._canvas.offsetWidth;
        this._height = this._canvas.offsetHeight;
        this._renderer.setSize(this._width, this._height, false);

        this._controls.handleResize();
        this.updateCamera();
    }

    /**
     * Handles a window resize event
     */
    onResizeWindow () {

        this.resizeDisplayWebGL();
    }
//#endregion

//#region Render Loop
    /**
     * Performs the WebGL render of the scene
     */
    renderWebGL() {

        this._controls.update();
        this._renderer.render(this._scene, this.camera);
    }

    /**
     * Main DOM render loop
     */
    animate() {

        requestAnimationFrame(this.animate.bind(this));
        this.renderWebGL();
    }
//#endregion
} 

