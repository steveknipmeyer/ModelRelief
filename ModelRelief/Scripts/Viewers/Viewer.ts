// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE               from 'three'
import {Camera}                 from 'Camera'
import {CameraHelper }          from 'CameraHelper'
import {CameraControls}         from 'CameraControls'
import {EventManager}           from 'EventManager'
import {Graphics, ObjectNames}  from 'Graphics'
import {StandardView}           from "ICamera"
import {ILogger}                from 'Logger'
import {Materials}              from 'Materials'
import {Services}               from 'Services'
import {TrackballControls}      from 'TrackballControls'

/**
 * @exports Viewer/Viewer
 */
export class Viewer {

    _name                   : string                    = '';
    _eventManager          : EventManager              = null;
    _logger                 : ILogger                    = null;
    
    _scene                  : THREE.Scene               = null;
    _root                   : THREE.Object3D            = null;      
                                                        
    _renderer               : THREE.WebGLRenderer       = null;;
    _canvas                 : HTMLCanvasElement         = null;
    _width                  : number                    = 0;
    _height                 : number                    = 0;

    _camera                 : THREE.PerspectiveCamera   = null;

    _controls               : TrackballControls         = null;
    _cameraControls         : CameraControls            = null;
    
    /**
     * Default constructor
     * @class Viewer
     * @constructor
     * @param name Viewer name.
     * @param elementToBindTo HTML element to host the viewer.
     */
    constructor(name : string, modelCanvasId : string) { 

        this._name         = name;                    
        this._eventManager  = new EventManager();
        this._logger       = Services.defaultLogger;

        this._canvas = Graphics.initializeCanvas(modelCanvasId);
        this._width  = this._canvas.offsetWidth;
        this._height = this._canvas.offsetHeight;

        this.initialize();

        this.animate();
    }

//#region Properties

    /**
     * Gets the Viewer name.
     */
    get name() : string {
        
        return this._name;
    }

    /**
     * Gets the Viewer scene.
     */
    get scene() : THREE.Scene {

        return this._scene;
    }

    /**
     * Sets the Viewer scene.
     */
    set scene(value: THREE.Scene) {

        this._scene = value;
    }
        
    /**
     * Gets the camera.
     */
    get camera() : THREE.PerspectiveCamera{
        
        return this._camera;
    }

    /**
     * Sets the camera.
     */
    set camera(camera : THREE.PerspectiveCamera) {
        
        this._camera = camera;
        this.camera.name = this.name;
        this.initializeInputControls();

        if (this._cameraControls)
            this._cameraControls.synchronizeCameraSettings();
        }
        
     /**
     * Gets the active model.
     */
    get model() : THREE.Group {

        return this._root;
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

    /**
     * Gets the DOM Id of the Viewer parent container.
     */
    get containerId() : string {
        
        let parentElement : HTMLElement = this._canvas.parentElement;
        return parentElement.id;
    } 

    /**
     * Gets the Event Manager.
     */
    get eventManager(): EventManager {

        return this._eventManager;
    }
        
//#endregion

//#region Initialization    
    /**
     * Adds a test sphere to a scene.
     */
    populateScene () {

        let mesh = Graphics.createSphereMesh(new THREE.Vector3(), 2);
        mesh.visible = false;
        this._root.add(mesh);
    }

    /**
     * Initialize Scene
     */
    initializeScene () {

        this.scene = new THREE.Scene();
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
    initializeCamera() {
        this.camera = CameraHelper.getStandardViewCamera(StandardView.Front, this.aspectRatio, this.model);       
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
     * Sets up the user input controls (Trackball)
     */
    initializeInputControls() {

        this._controls = new TrackballControls(this.camera, this._renderer.domElement);

        // N.B. https://stackoverflow.com/questions/10325095/threejs-camera-lookat-has-no-effect-is-there-something-im-doing-wrong
        this._controls.position0.copy(this.camera.position);

        let boundingBox = Graphics.getBoundingBoxFromObject(this._root);
        this._controls.target.copy(boundingBox.getCenter());
    }

    /**
     * Sets up the user input controls (Settings)
     */
    initializeUIControls() {

        this._cameraControls = new CameraControls(this);       
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
                    this.camera = CameraHelper.getStandardViewCamera(StandardView.Front, this.aspectRatio, this.model);
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
        this.initializeUIControls();
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
        this.scene.add(this._root);
    }

//#endregion

//#region Camera
    
    /**
     * @description Sets the view camera properties to the given settings.
     * @param {StandardView} view Camera settings to apply.
     */
    setCameraToStandardView(view : StandardView) {

        let standardViewCamera = CameraHelper.getStandardViewCamera(view, this.aspectRatio, this.model);
        this.camera = standardViewCamera;

        this._cameraControls.synchronizeCameraSettings(view);
    }

    /**
     * @description Fits the active view.
     */
    fitView() {

        this.camera = CameraHelper.getFitViewCamera (CameraHelper.getSceneCamera(this.camera, this.aspectRatio), this.model);
    }
           
//#endregion

//#region Window Resize
    /**
     * Updates the scene camera to match the new window size
     */
    updateCameraOnWindowResize() {

        this.camera.aspect = this.aspectRatio;
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
        this._renderer.render(this.scene, this.camera);
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

