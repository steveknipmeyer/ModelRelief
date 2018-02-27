// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                                   from 'three';
import {Camera}                                     from 'Camera';
import {CameraHelper }                              from 'CameraHelper';
import {CameraControls, CameraControlsOptions}      from 'CameraControls';
import {EventManager}                               from 'EventManager';
import {FileModel}                                  from 'FileModel';
import {Graphics, ObjectNames}                      from 'Graphics';
import {StandardView}                               from 'ICamera';
import {ILogger}                                    from 'Logger';
import {Materials}                                  from 'Materials';
import {Services}                                   from 'Services';
import {TrackballControls}                          from 'TrackballControls';

/**
 * @description General 3D model viewer base class.
 * @export
 * @class Viewer
 */
export class Viewer {

    cameraControls         : CameraControls            = null;

    // Private
    _name                   : string                    = '';
    _eventManager           : EventManager               = null;
    _logger                 : ILogger                   = null;

    _model                  : FileModel                 = null;
    _scene                  : THREE.Scene               = null;
    _root                   : THREE.Object3D            = null;      
                                                        
    _renderer               : THREE.WebGLRenderer       = null;;
    _canvas                 : HTMLCanvasElement         = null;
    _width                  : number                    = 0;
    _height                 : number                    = 0;

    _camera                 : THREE.PerspectiveCamera   = null;

    _controls               : TrackballControls         = null;
    
    /**
     * Creates an instance of Viewer.
     * @param {string} name Viewer name.
     * @param {string} modelCanvasId HTML element to host the viewer.
     */
    constructor(name : string, modelCanvasId : string, model? : FileModel) { 

        this._name         = name;                    
        this._eventManager = new EventManager();
        this._logger       = Services.defaultLogger;

        this._canvas = Graphics.initializeCanvas(modelCanvasId);
        this._width  = this._canvas.offsetWidth;
        this._height = this._canvas.offsetHeight;

        this._model = model;
        this.initialize();

        this.animate();
    }

//#region Properties
    /**
     * @description Gets the Viewer name.
     * @readonly
     * @type {string}
     */
    get name() : string {
        
        return this._name;
    }

    /**
     * @description Gets the Viewer scene.
     * @type {THREE.Scene}
     */
    get scene() : THREE.Scene {

        return this._scene;
    }

    /**
     * @description Sets the Viewer scene.
     */
    set scene(value: THREE.Scene) {

        this._scene = value;
    }
        
    /**
     * @description Gets the camera.
     * @type {THREE.PerspectiveCamera}
     */
    get camera() : THREE.PerspectiveCamera{
        
        return this._camera;
    }

    /**
     * @description Sets the camera.
     */
    set camera(camera : THREE.PerspectiveCamera) {
        
        this._camera = camera;
        this.camera.name = this.name;
        this.initializeInputControls();

        if (this.cameraControls)
            this.cameraControls.synchronizeCameraSettings();
        }

    /**
     * @description Returns the active model.
     * @readonly
     * @type {FileModel}
     */
    get model() : FileModel {

        return this._model;
    }

    /**
     * @description Sets the active model.
     */
    set model (model : FileModel) {

        this._model = model;
    }

    /**
     * @description Gets the graphics object of the active model.
     * @readonly
     * @type {THREE.Group}
     */
    get modelGroup() : THREE.Group {

        return this._root;
    }

    /**
     * @description Sets the graphics of the displayed model.
     * @param {THREE.Group} modelGroup New model to activate.
     */
    setModelGroup(modelGroup : THREE.Group) {

        // N.B. This is a method not a property so a sub class can override.
        // https://github.com/Microsoft/TypeScript/issues/4465

        Graphics.removeObjectChildren(this._root, false);
        this._root.add(modelGroup);
    }

    /**
     * @description Loads the active model from disk.
     */
    async loadModelAsync() {

        let modelGroup = await this.model.getModelGroupAsync();
        this.setModelGroup(modelGroup);            
    }

    /**
     * @description Calculates the aspect ratio of the canvas afer a window resize
     * @readonly
     * @type {number}
     */
    get aspectRatio() : number {

        let aspectRatio : number = this._width / this._height;
        return aspectRatio;
    } 

    /**
     * @description Gets the DOM Id of the Viewer parent container.
     * @readonly
     * @type {string}
     */
    get containerId() : string {
        
        let parentElement : HTMLElement = this._canvas.parentElement;
        return parentElement.id;
    } 

    /**
     * @description Gets the Event Manager.
     * @readonly
     * @type {EventManager}
     */
    get eventManager(): EventManager {

        return this._eventManager;
    }
//#endregion

//#region Initialization    
    /**
     * @description Adds a test sphere to a scene.
     */
    populateScene () {

        let mesh = Graphics.createSphereMesh(new THREE.Vector3(), 2);
        mesh.visible = false;
        this._root.add(mesh);
    }

    /**
     * @description Initialize Scene
     */
    initializeScene () {

        this.scene = new THREE.Scene();
        this.createRoot();

        this.populateScene();
    }

    /**
     * @description Initialize the WebGL renderer.
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
     * @description Initialize the viewer camera
     */
    initializeCamera() {
        this.camera = CameraHelper.getStandardViewCamera(StandardView.Top, this.aspectRatio, this.modelGroup);       
    }

    /**
     * @description Adds lighting to the scene
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
     * @description Sets up the user input controls (Trackball)
     */
    initializeInputControls() {

        this._controls = new TrackballControls(this.camera, this._renderer.domElement);

        // N.B. https://stackoverflow.com/questions/10325095/threejs-camera-lookat-has-no-effect-is-there-something-im-doing-wrong
        this._controls.position0.copy(this.camera.position);

        let boundingBox = Graphics.getBoundingBoxFromObject(this._root);
        this._controls.target.copy(boundingBox.getCenter());
    }

    /**
     * @description Sets up the user input controls (Settings)
     * @param {CameraControlsOptions} [cameraControlsOptions] Options to include/exclude specialized controls.
     */
    initializeUIControls(cameraControlsOptions? : CameraControlsOptions) {

        this.cameraControls = new CameraControls(this, cameraControlsOptions);       
    }

    /**
     * @description Sets up the keyboard shortcuts.
     */
    initializeKeyboardShortcuts() {

        document.addEventListener('keyup', (event : KeyboardEvent) => {

            // https://css-tricks.com/snippets/javascript/javascript-keycodes/
            let keyCode : number = event.keyCode;
            switch (keyCode) {

                case 70:                // F               
                    this.camera = CameraHelper.getStandardViewCamera(StandardView.Front, this.aspectRatio, this.modelGroup);
                    break;
            }
            }, false);
    }

    /**
     * @description Initialize the scene with the base objects
     */
    initialize () {

        this.initializeScene();
        this.initializeRenderer();
        this.initializeCamera();
        this.initializeLighting();
        this.initializeInputControls();
        this.initializeUIControls();
        this.initializeKeyboardShortcuts();

        this.onResizeWindow();
        window.addEventListener('resize', this.onResizeWindow.bind(this), false);
    }
//#endregion

//#region Scene
    /**
     * @description Removes all scene objects
     */
    clearAllAssests() {
        
        Graphics.removeObjectChildren(this._root, false);
    } 

    /**
     * @description Creates the root object in the scene
     */
    createRoot() {

        this._root = new THREE.Object3D();
        this._root.name = ObjectNames.Root;
        this.scene.add(this._root);
    }
//#endregion

//#region Camera  
    /**
     * @description Sets the view camera properties to the given settings.
     * @param {StandardView} view Camera settings to apply.
     */
    setCameraToStandardView(view : StandardView) {

        let standardViewCamera = CameraHelper.getStandardViewCamera(view, this.aspectRatio, this.modelGroup);
        this.camera = standardViewCamera;

        this.cameraControls.synchronizeCameraSettings(view);
    }

    /**
     * @description Fits the active view.
     */
    fitView() {

        CameraHelper.setDefaultClippingPlanes(this.camera);
        this.camera = CameraHelper.getFitViewCamera (this.camera, this.modelGroup);
    }
//#endregion

//#region Window Resize
    /**
     * @description Updates the scene camera to match the new window size
     */
    updateCameraOnWindowResize() {

        this.camera.aspect = this.aspectRatio;
        this.camera.updateProjectionMatrix();
    }

    /**
     * @description Handles the WebGL processing for a DOM window 'resize' event
     */
    resizeDisplayWebGL() {

        this._width =  this._canvas.offsetWidth;
        this._height = this._canvas.offsetHeight;
        this._renderer.setSize(this._width, this._height, false);

        this._controls.handleResize();
        this.updateCameraOnWindowResize();
    }

    /**
     * @description Handles a window resize event
     */
    onResizeWindow () {

        this.resizeDisplayWebGL();
    }
//#endregion

//#region Render Loop
    /**
     * @description Performs the WebGL render of the scene
     */
    renderWebGL() {

        this._controls.update();
        this._renderer.render(this.scene, this.camera);
    }

    /**
     * @description Main DOM render loop.
     */
    animate() {

        requestAnimationFrame(this.animate.bind(this));
        this.renderWebGL();
    }
//#endregion
} 

