// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                   from 'three'

import {CameraSettings, Graphics}   from 'Graphics'
import {Logger, HTMLLogger}         from 'Logger'
import {MathLibrary}                from 'Math'
import {Services}                   from 'Services'
import {TrackballControls}          from 'TrackballControls'

/**
 * @class
 * MeshViewer
 */
export class MeshPreviewViewer {

    _scene              : THREE.Scene               = null;;
    _root               : THREE.Group               = null;

    _renderer           : THREE.WebGLRenderer       = null;;
    _canvas             : HTMLCanvasElement         = null;
    _width              : number                    = 0;
    _height             : number                    = 0;

    _camera             : THREE.PerspectiveCamera   = null;
    _defaultCameraSettings  : CameraSettings            = null;

    _controls           : TrackballControls         = null;

    _logger             : Logger                    = null;
    
    /**
     * @constructor
     */
    constructor(previewCanvasId : string) {

        this._logger = Services.htmlLogger;       

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
     * Constructs the scene used to visualize the 3D mesh.
     */
    initializeScene() {
    
        this._scene = new THREE.Scene();
        this._root = new THREE.Group();
        this._scene.add(this._root);
    }

    /**
     * Initializes the preview renderer used to view the 3D mesh.
     */
    initializeRenderer() {

        this._renderer = new THREE.WebGLRenderer( {canvas : this._canvas});
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(this._width, this._height);
    }

    /**
     * Initializes perspective camera.
     */
    initializeCamera() {

        this._defaultCameraSettings = {

            position:       new THREE.Vector3(0.0, 0.0, 4.0),
            target:         new THREE.Vector3(0, 0, 0),
            near:           2.0,
            far:            10.0,
            fieldOfView:    37                                  // https://www.nikonians.org/reviews/fov-tables
        };

        this._camera = new THREE.PerspectiveCamera(this._defaultCameraSettings.fieldOfView, this.aspectRatio, this._defaultCameraSettings.near, this._defaultCameraSettings.far);
        this._camera.position.copy(this._defaultCameraSettings.position);

        this.resetCamera();
    }

    /**
     * Adds lighting to the scene.
     */
    initializeLighting() {

        let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this._scene.add(ambientLight);

        let directionalLight1 = new THREE.DirectionalLight(0xffffff);
        directionalLight1.position.set(4, 4, 4);
        this._scene.add(directionalLight1);
    }

    /**
     * Sets up the user input controls (Trackball)
     */
    initializeInputControls() {

        this._controls = new TrackballControls(this._camera, this._renderer.domElement);
    }

    /**
     * Initialize the application.
     */
    initialize() {

        this.initializeScene();
        this.initializeRenderer();
        this.initializeCamera();
        this.initializeLighting();
        this.initializeInputControls();

        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

//#endregion

//#region Scene
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
//#endregion

//#region Camera
    /**
     * Resets all camera properties to the defaults
     */
    resetCamera() {

        this._camera.position.copy(this._defaultCameraSettings.position);
        this.updateCamera();
    }
//#endregion

//#region Window Resize
    /**
     * Updates the scene camera to match the new window size
     */
    updateCamera() {

        this._camera.aspect = this.aspectRatio;
        this._camera.lookAt(this._defaultCameraSettings.target);
        this._camera.updateProjectionMatrix();
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
    onWindowResize () {

        this.resizeDisplayWebGL();
    }
//#endregion

//#region Render Loop
    /**
     * Performs the WebGL render of the scene
     */
    renderWebGL() {

        this._controls.update();
        this._renderer.render(this._scene, this._camera);
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