// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";
import * as THREE from "three";

import {StandardView} from "Scripts/Api/V1/Interfaces/ICamera";
import {FileModel} from "Scripts/Models/Base/FileModel";
import {Graphics, ObjectNames} from "Scripts/Graphics/Graphics";
import {IThreeBaseCamera} from "Scripts/Graphics/IThreeBaseCamera";
import {CameraHelper} from "Scripts/Models/Camera/CameraHelper";
import {EventManager, EventType} from "Scripts/System/EventManager";
import {ElementIds} from "Scripts/System/Html";
import {ILogger} from "Scripts/System/Logger";
import {MathLibrary} from "Scripts/System/Math";
import {Services} from "Scripts/System/Services";
import {IInputController, InputControllerHelper} from "Scripts/Viewers/InputControllerHelper";
import {OrthographicTrackballControls} from "Scripts/Viewers/OrthographicTrackballControls";
import {TrackballControls} from "Scripts/Viewers/TrackballControls";

/**
 * @description General 3D model viewer base class.
 * @export
 * @class Viewer
 */
export class Viewer {

    // Protected
    protected _logger: ILogger               = null;

    // Private
    private _name: string                    = "";
    private _viewContainerId: string         = "";
    private _eventManager: EventManager      = null;

    private _model: FileModel                = null;
    private _scene: THREE.Scene              = null;
    private _root: THREE.Group             = null;

    private _renderer: THREE.WebGLRenderer   = null;
    private _canvas: HTMLCanvasElement       = null;
    private _width: number                   = 0;
    private _height: number                  = 0;

    private _camera: IThreeBaseCamera        = null;

    private _controls: TrackballControls | OrthographicTrackballControls = null;

    /**
     * Creates an instance of Viewer.
     * @param {string} name Viewer name.
     * @param {string} viewContainerId Container of the view. The view holds the controls.
     * @param {string} modelCanvasId HTML element to host the viewer.
     */
    constructor(name: string, viewContainerId: string, modelCanvasId: string, model?: FileModel) {

        this._name         = name;
        this._eventManager = new EventManager();
        this._logger       = Services.defaultLogger;

        this._viewContainerId = viewContainerId;

        this._canvas = Graphics.initializeCanvas(modelCanvasId);
        this._width  = this._canvas.offsetWidth;
        this._height = this._canvas.offsetHeight;

        this._model = model;
        this.initialize();
    }

//#region Properties
    /**
     * @description Gets the Viewer name.
     * @readonly
     * @type {string}
     */
    get name(): string {

        return this._name;
    }

    /**
     * @description Gets the View container Id.
     * @readonly
     * @type {string}
     */
    get viewContainerId(): string {

        return this._viewContainerId;
    }

    /**
     * @description Gets the Viewer scene.
     * @type {THREE.Scene}
     */
    get scene(): THREE.Scene {

        return this._scene;
    }

    /**
     * @description Sets the Viewer scene.
     */
    set scene(value: THREE.Scene) {

        this._scene = value;
    }

    /**
     * @description Gets the root Group of the scene.
     * @type {THREE.Scene}
     */
    get root(): THREE.Group {

        return this._root;
    }

    /**
     * @description Sets the root Group of the scene.
     */
    set root(value: THREE.Group) {

        this._root = value;
    }

    /**
     * @description Gets the camera.
     * @type {IThreeBaseCamera}
     */
    get camera(): IThreeBaseCamera {

        return this._camera;
    }

    /**
     * @description Sets the camera.
     */
    set camera(camera: IThreeBaseCamera) {
        //CameraHelper.debugCameraProperties(camera, this.modelGroup, `${this.name} Before`);

        // Update the orthographic frustum if necessary. A persisted camera may have been defined against a different view.
        if (camera instanceof THREE.OrthographicCamera) {
            const cameraAspectRatio = (camera.right - camera.left) / (camera.top - camera.bottom);
            const tolerance = 0.01;
            if (!MathLibrary.numbersEqualWithinTolerance(cameraAspectRatio, this.aspectRatio, tolerance)) {
                this._logger.addWarningMessage(`Orthographic camera aspect ratio ${cameraAspectRatio} update to match View aspect ratio ${this.aspectRatio}`);
                CameraHelper.setDefaultOrthographicFrustum(camera, this.aspectRatio);
            }
        }

        this._camera = camera;
        this.camera.name = this.name;
        //CameraHelper.debugCameraProperties(this.camera, this.modelGroup, `${this.name} After`);

        this.initializeInputControls();

        this.eventManager.dispatchEvent(this, EventType.ViewerCameraProperties, camera);
    }

    /**
     * @description Returns the active model.
     * @readonly
     * @type {FileModel}
     */
    get model(): FileModel {

        return this._model;
    }

    /**
     * @description Sets the active model.
     */
    set model(model: FileModel) {

        this._model = model;
    }

    /**
     * @description Gets the graphics object of the active model.
     * @readonly
     * @type {THREE.Group}
     */
    get modelGroup(): THREE.Group {
        return this._root;
    }

    /**
     * @description Sets the graphics of the displayed model.
     * @param {THREE.Group} modelGroup New model to activate.
     */
    public setModelGroup(modelGroup: THREE.Group): void {

        // N.B. This is a method not a property so a sub class can override.
        // https://github.com/Microsoft/TypeScript/issues/4465

        Graphics.removeObjectChildren(this._root, false);
        this._root.add(modelGroup);

        this.enableProgressBar(false);
    }

    /**
     * @description Calculates the aspect ratio of the canvas afer a window resize
     * @readonly
     * @type {number}
     */
    get aspectRatio(): number {

        const aspectRatio: number = this._width / this._height;
        return aspectRatio;
    }

    /**
     * @description Gets the DOM Id of the Viewer parent container.
     * @readonly
     * @type {string}
     */
    get containerId(): string {

        const parentElement: HTMLElement = this._canvas.parentElement;
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

    /**
     * @description Get the input controller.
     * @type {TrackballControls | OrthographicTrackballControls}
     */
    get controls(): TrackballControls | OrthographicTrackballControls {

        return this._controls;
    }

//#endregion

//#region Initialization
    /**
     * @description Adds a test sphere to a scene.
     */
    public populateScene(): void {

        const mesh = Graphics.createSphereMesh(new THREE.Vector3(), 2);
        mesh.visible = false;
        this._root.add(mesh);
    }

    /**
     * @description Initialize Scene
     */
    public initializeScene(): void {

        this.scene = new THREE.Scene();
        this.createRoot();

        this.populateScene();
    }

    /**
     * @description Initialize the WebGL renderer.
     */
    public initializeRenderer(): void {

        this._renderer = new THREE.WebGLRenderer({

            logarithmicDepthBuffer  : false,
            canvas                  : this._canvas,
            antialias               : true,
        });
        this._renderer.autoClear = true;
        this._renderer.setClearColor(0x000000);
    }

    /**
     * @description Initialize the viewer camera
     */
    public initializeCamera(): void {
        this.camera = CameraHelper.getStandardViewCamera(StandardView.Top, this.camera, this.aspectRatio, this.modelGroup);
    }

    /**
     * @description Adds lighting to the scene
     */
    public initializeLighting(): void {

        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        const directionalLight1 = new THREE.DirectionalLight(0xC0C090);
        directionalLight1.position.set(-100, -50, 100);
        this.scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xC0C090);
        directionalLight2.position.set(100, 50, -100);
        this.scene.add(directionalLight2);
    }

    /**
     * @description Sets up the user input controls (Trackball or OrthographicTrackballControls)
     */
    public initializeInputControls(): void {

        //  capture active lookAt before initializing input controller
        const cameraLookAt: THREE.Vector3 = CameraHelper.getLookAt(this.camera, this.modelGroup);

        if (this.controls)
            this.controls.dispose();

        this._controls = this.camera instanceof THREE.PerspectiveCamera ?
            new TrackballControls(this.camera as THREE.PerspectiveCamera, this._renderer.domElement) :
            new OrthographicTrackballControls(this.camera as THREE.OrthographicCamera, this._renderer.domElement);

        // restore lookAt
        this.camera.lookAt(cameraLookAt);
        InputControllerHelper.setTarget(this.controls, cameraLookAt);
    }

    /**
     * @description Sets up the user input controls (Settings)
     */
    public initializeUIControls(): void {
        // NOP
    }

    /**
     * @description Event handler for  keyboard shortcuts.
     *              Chained from the input control (TrackballControls, OrthographicTrackballControls) handler.
     * @param {KeyboardEvent} event
     * @returns
     */
    public keydownHandler(event: KeyboardEvent): void {
        let standardView = StandardView.None;

        // https://css-tricks.com/snippets/javascript/javascript-keycodes/
        const keyCode: number = event.keyCode;
        switch (keyCode) {

            case "B".charCodeAt(0):
            case "b".charCodeAt(0):
                standardView = StandardView.Bottom;
                break;
            case "F".charCodeAt(0):
            case "f".charCodeAt(0):
                standardView = StandardView.Front;
                break;
            case "I".charCodeAt(0):
            case "i".charCodeAt(0):
                standardView = StandardView.Isometric;
                break;
            case "L".charCodeAt(0):
            case "l".charCodeAt(0):
                standardView = StandardView.Left;
                break;
            case "R".charCodeAt(0):
            case "r".charCodeAt(0):
                standardView = StandardView.Right;
                break;
            case "T".charCodeAt(0):
            case "t".charCodeAt(0):
                standardView = StandardView.Top;
                break;
            case "X".charCodeAt(0):
            case "x".charCodeAt(0):
                standardView = StandardView.Back;
                break;

            default:
                return;
        }
        this.setCameraToStandardView(standardView);
    }

    /**
     * @description Sets up the keyboard shortcuts.
     */
    public initializeKeyboardShortcuts(): void {

        this._canvas.addEventListener("keyup", (event: KeyboardEvent) => {
            this.keydownHandler(event);
        });
    }

    /**
     * @description Initializes diagnostic tools for debugging.
     */
    public initializeDiagnostics(): void {

        if (this._canvas.id !== ElementIds.ModelCanvas)
            return;

        const interval = 1000;
        window.setTimeout(() => {
            InputControllerHelper.debugInputControllerProperties(this._logger, this.name, this.controls, this.scene, this.camera);
            // loop
            // this.initializeDiagnostics();
        }, interval);
    }

    /**
     * @description Initialize the scene with the base objects
     */
    public initialize(): void {

        this.initializeScene();
        this.initializeRenderer();
        this.initializeCamera();
        this.initializeLighting();
        this.initializeInputControls();
        this.initializeUIControls();
        this.initializeKeyboardShortcuts();
        // this.initializeDiagnostics();

        this.onResizeWindow();
        window.addEventListener("resize", this.onResizeWindow.bind(this), false);
    }
//#endregion

//#region Scene
    /**
     * @description Removes all scene objects
     */
    public clearAllAssets(): void {

        Graphics.removeObjectChildren(this._root, false);
    }

    /**
     * @description Creates the root object in the scene
     */
    public createRoot(): void {

        this._root = new THREE.Group();
        this._root.name = ObjectNames.Root;
        this.scene.add(this._root);
    }
//#endregion

//#region Camera
    /**
     * @description Sets the view camera properties to the given view.
     * @param {StandardView} standardView Standard camera view to apply.
     */
    public setCameraToStandardView(standardView: StandardView): IThreeBaseCamera {

        const standardViewCamera = CameraHelper.getStandardViewCamera(standardView, this.camera, this.aspectRatio, this.modelGroup);

        this.camera = standardViewCamera;

        this.eventManager.dispatchEvent(this, EventType.ViewerCameraStandardView, standardView);

        return this.camera;
    }

    /**
     * @description Fits the active view.
     */
    public fitView(): void {

        CameraHelper.setDefaultClippingPlanes(this.camera);
        this.camera = CameraHelper.getFitViewCamera (this.camera, this.aspectRatio, this.modelGroup);
    }
//#endregion

//#region Window Resize
    /**
     * @description Updates the scene camera to match the new window size
     */
    public updateCameraOnWindowResize(): void {
        if (this.camera instanceof THREE.PerspectiveCamera)
            this.camera.aspect = this.aspectRatio;

        this.camera.updateProjectionMatrix();
    }

    /**
     * @description Handles the WebGL processing for a DOM window 'resize' event
     */
    public resizeDisplayWebGL(): void {

        this._width =  this._canvas.offsetWidth;
        this._height = this._canvas.offsetHeight;
        this._renderer.setSize(this._width, this._height, false);

        this.controls.handleResize();
        this.updateCameraOnWindowResize();
    }

    /**
     * @description Handles a window resize event
     */
    public onResizeWindow(): void {

        this.resizeDisplayWebGL();
    }
//#endregion

//#region Render Loop
    /**
     * @description Performs the WebGL render of the scene
     */
    public renderWebGL(): void {

        this.controls.update();
        this._renderer.render(this.scene, this.camera);
    }

    /**
     * @description Main DOM render loop.
     */
    public animate(): void {

        requestAnimationFrame(this.animate.bind(this));
        this.renderWebGL();
    }
//#endregion

//#region Utility
    /**
     * @description Activates the progress bar.
     * @param {boolean} enable
     */
    public enableProgressBar(enable: boolean): void {

        const progressBar = document.querySelector(`#${this.viewContainerId} #${ElementIds.ProgressBar}`) as HTMLDivElement;
        progressBar.style.visibility = enable ? "visible" : "hidden";
    }
//#endregion
}

