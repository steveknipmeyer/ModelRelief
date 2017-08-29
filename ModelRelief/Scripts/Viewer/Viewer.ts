// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                               from 'three'
import {Camera, CameraSettings, StandardView}   from 'Camera'
import {EventManager}                           from 'EventManager'
import {Graphics}                               from 'Graphics'
import {Logger}                                 from 'Logger'
import {Materials}                              from 'Materials'
import {Services}                               from 'Services'
import {TrackballControls}                      from 'TrackballControls'

const ObjectNames = {
    Root :  'Root'
}

/**
 * @exports Viewer/Viewer
 */
export class Viewer {

    _eventManager           : EventManager              = null;
    _logger                 : Logger                    = null;
    
    _scene                  : THREE.Scene               = null;
    _root                   : THREE.Object3D            = null;      
                                                        
    _renderer               : THREE.WebGLRenderer       = null;;
    _canvas                 : HTMLCanvasElement         = null;
    _width                  : number                    = 0;
    _height                 : number                    = 0;

    _camera                 : THREE.PerspectiveCamera   = null;
    _defaultCameraSettings  : CameraSettings            = null;

    _controls               : TrackballControls         = null;

    /**
     * Default constructor
     * @class Viewer
     * @constructor
     * @param elementToBindTo HTML element to host the viewer.
     */
    constructor(modelCanvasId : string) {
                    
        this._eventManager = new EventManager();
        this._logger       = Services.consoleLogger;

        this._canvas = Graphics.initializeCanvas(modelCanvasId);
        this._width  = this._canvas.offsetWidth;
        this._height = this._canvas.offsetHeight;

        this.initialize();

        this.animate();
    }

//#region Properties
    /**
     * Gets the active model.
     */
    get model() : THREE.Group {

        return this._root;
    }

    /**
     * Gets the EventManager.
     */
    get eventManager() : EventManager {
        
        return this._eventManager;
    }
        
    /**
     * Sets the active model.
     * @param value New model to activate.
     */
    setModel(value : THREE.Group) {

        // N.B. This is a method not a property so a sub class can override.
        // https://github.com/Microsoft/TypeScript/issues/4465

        Graphics.removeObjectChildren(this._root, false);
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
     * Adds a test sphere to a scene.
     */
    populateScene () {

        let mesh = Graphics.createSphereMesh(new THREE.Vector3(), 2);
        this._root.add(mesh);
    }

    /**
     * Initialize Scene
     */
    initializeScene () {

        this._scene = new THREE.Scene();
        this.createRoot();

        this.populateScene();
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
    initializeDefaultCameraSettings () : CameraSettings {

        return Camera.getStandardViewSettings(StandardView.Front, this.model, this.aspectRatio);
    }
        
    /**
     * Initialize the viewer camera
     */
    initializeCamera() {
    
        this._defaultCameraSettings = this.initializeDefaultCameraSettings();
        this._camera = new THREE.PerspectiveCamera(this._defaultCameraSettings.fieldOfView, this.aspectRatio, this._defaultCameraSettings.near, this._defaultCameraSettings.far);

        this.resetCameraToDefaultSettings();
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

        this._controls = new TrackballControls(this._camera, this._renderer.domElement);

        // N.B. https://stackoverflow.com/questions/10325095/threejs-camera-lookat-has-no-effect-is-there-something-im-doing-wrong
        this._controls.position0.copy(this._camera.position);
        this._controls.target.copy(this._defaultCameraSettings.target);
    }

    /**
     * Sets up the keyboard shortcuts.
     */
    initializeKeyboardShortcuts() {

        document.addEventListener('keyup', (event : KeyboardEvent) => {

            // https://css-tricks.com/snippets/javascript/javascript-keycodes/
            let keyCode : number = event.keyCode;
            switch (keyCode) {

                case 70:                // F                    
                    let settings : CameraSettings = Camera.getStandardViewSettings(StandardView.Front, this.model, this.aspectRatio);
                    this.applyCameraSettings(settings);
                    break;
            }
            }, false);
    }

    /**
     * Initialize the scene with the base objects
     */
    initialize () {

        this.initializeScene();
        this.initializeRenderer();
        this.initializeCamera();
        this.initializeLighting();
        this.initializeInputControls();
        this.initializeKeyboardShortcuts();

        this.onResizeWindow();
        window.addEventListener('resize', this.onResizeWindow.bind(this), false);
    }
//#endregion

//#region Scene
    /**
     * Removes all scene objects
     */
    clearAllAssests() {
        
        Graphics.removeObjectChildren(this._root, false);
    } 

    /**
     * Creates the root object in the scene
     */
    createRoot() {

        this._root = new THREE.Object3D();
        this._root.name = ObjectNames.Root;
        this._scene.add(this._root);
    }

//#endregion

//#region Camera

    /**
     * @description Resets all camera properties to the defaults
     * @param {CameraSettings} settings Settings to apply to camera.
     */
    applyCameraSettings(settings : CameraSettings) {
        
        this._camera.position.copy(settings.position);       
        this._camera.lookAt(settings.target);
        this._camera.near = settings.near;
        this._camera.far  = settings.far;
        this._camera.fov  = settings.fieldOfView;
        
        this._camera.up.set(0, 1, 0);

        this.updateCameraOnWindowResize();
        this.initializeInputControls();
    }
    
    /**
     * @description Sets the view camera properties to the given settings.
     * @param {StandardView} view Camera settings to apply.
     */
    setCameraToStandardView(view : StandardView) {

        this._defaultCameraSettings = Camera.getStandardViewSettings(view, this.model,  this.aspectRatio);
        this.resetCameraToDefaultSettings();
    }
            
    /**
     * @description Resets all camera properties to the defaults.
     */
    resetCameraToDefaultSettings() {
        
        this.applyCameraSettings (this._defaultCameraSettings);
    }

    /**
     * @description Fits the active view.
     */
    fitView() {

        let fitViewSettings = Camera.getFitViewSettings (this.model, this._camera.aspect);
        this.applyCameraSettings(fitViewSettings);
    }
    
//#endregion

//#region Window Resize
    /**
     * Updates the scene camera to match the new window size
     */
    updateCameraOnWindowResize() {

        this._camera.aspect = this.aspectRatio;
        // this._camera.lookAt(this._defaultCameraSettings.target);
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
        this.updateCameraOnWindowResize();
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

