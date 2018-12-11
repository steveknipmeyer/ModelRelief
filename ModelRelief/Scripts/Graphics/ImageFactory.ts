// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto from "Scripts/Api/V1//Models/DtoModels";
import * as THREE from "three";

import {Graphics, ObjectNames} from "Scripts/Graphics/Graphics";
import {ImageFactorySettings} from "Scripts/Graphics/ImageFactorySettings";
import {TestModel, TestModelLoader} from "Scripts/ModelLoaders/TestModelLoader";
import {BaseCamera} from "Scripts/Models/Camera/BaseCamera";
import {ILogger} from "Scripts/System/Logger";
import {Services} from "Scripts/System/Services";
import {Tools} from "Scripts/System/Tools";

/*
  Requirements
    Fixed resolution; resizing support is not required.
*/
/**
 * @description Constructor parameters for ImageFactory.
 * @export
 * @interface ImageFactoryParameters
 */
export interface IImageFactoryParameters {

    canvas: HTMLCanvasElement;       // Canvas element (any size)
    width: number;                   // width of DB
    height: number;                  // height of DB
    modelGroup: THREE.Group;         // model root
    camera: BaseCamera;              // camera

    logDepthBuffer?: boolean;        // use logarithmic depth buffer for higher resolution (better distribution) in scenes with large extents
}

/**
 * @class
 * ImageFactory
 */
export class ImageFactory {

    // Protected
    protected static CssClassName: string              = "ImageFactory";           // CSS class
    protected static RootContainerId: string           = "rootContainer";          // root container for viewers

    // protected
    protected _scene: THREE.Scene                      = null;     // target scene
    protected _root: THREE.Group                       = null;     // root object
    protected _modelGroup: THREE.Group                 = null;     // target model

    protected _renderer: THREE.WebGLRenderer           = null;     // scene renderer
    protected _canvas: HTMLCanvasElement               = null;     // DOM canvas supporting renderer
    protected _width: number                           = ImageFactorySettings.DefaultResolution;     // width resolution of the image
    protected _height: number                          = ImageFactorySettings.DefaultResolution;     // height resolution of the image

    protected _camera: BaseCamera                      = null;     // 3D model camera to generate the image

    protected _logDepthBuffer: boolean                 = false;    // use a logarithmic buffer for more accuracy in large scenes

    protected _target: THREE.WebGLRenderTarget         = null;     // WebGL render target (3D)
    protected _postTarget: THREE.WebGLRenderTarget     = null;     // WebGL render target (2D)

    protected _postScene: THREE.Scene                  = null;     // single polygon scene use to generate the encoded RGBA buffer
    protected _postRoot: THREE.Group                   = null;     // root object
    protected _postCamera: THREE.OrthographicCamera    = null;     // orthographic camera

    protected _minimumWebGL: boolean                   = true;     // true if minimum WeGL requirements are present
    protected _logger: ILogger                         = null;     // logger

    protected _minimumWebGLExtensions: string[]     = [];
    protected _debug: boolean                       = false;

    // Private

    /**
     * @constructor
     * @param parameters Initialization parameters (ImageFactoryParameters)
     */
    constructor(parameters?: IImageFactoryParameters) {

        const {
            // required
            canvas,
            width,
            height,
            modelGroup,
            camera,

            // optional
            logDepthBuffer  = false,
        } = parameters;

        this._canvas          = canvas;
        this._width           = width;
        this._height          = height;

//      this._modelGroup      = modelGroup.clone(true);
        const loader = new TestModelLoader();
        this._modelGroup = loader.loadTestModel(TestModel.Sphere);

        this._camera          = camera;

        // optional
        this._logDepthBuffer  = logDepthBuffer;

        this._canvas = this.initializeCanvas();
        this.initialize();
    }

//#region Properties
    /**
     * Returns the active canvas of the factory.
     * @returns HTMLElement
     */
    get canvas(): HTMLElement {
        return this._canvas;
    }

    /**
     * @description Removes all scene objects
     */
    public clearAllAssests() {

        Graphics.removeObjectChildren(this._root, false);
        Graphics.removeObjectChildren(this._postRoot, false);

        //this._renderer.context.getExtension("WEBGL_lose_context").loseContext();
        this._renderer.dispose();
        this._target.dispose();
        this._postTarget.dispose();
    }
//#endregion

//#region Initialization
     /**
      * Verifies the WebGL extensions are present.
      */
    protected verifyWebGLExtensions(): boolean {

        for (const extension of this._minimumWebGLExtensions) {
            if (!this._renderer.extensions.get(extension)) {
                this._minimumWebGL = false;
                this._logger.addErrorMessage(`The minimum WebGL extension ${extension} is not supported in the browser.`);
                return false;
            }
        }
        return true;
    }

    /**
     * Constructs a WebGL target canvas.
     */
    protected initializeCanvas(): HTMLCanvasElement {

        this._canvas.setAttribute("name", Tools.generatePseudoGUID());
        this._canvas.setAttribute("class", ImageFactory.CssClassName);

        // render dimensions
        this._canvas.width  = this._width;
        this._canvas.height = this._height;

        // DOM element dimensions (may be different than render dimensions)
        this._canvas.style.width  = `${this._width}px`;
        this._canvas.style.height = `${this._height}px`;

        return this._canvas;
    }

    /**
     * Initialize the shader material used in the primary 3D model scene.
     */
    protected initializeMaterial(): THREE.Material {
        return null;
    }

    /**
     * Perform setup and initialization of the render scene.
     */
    protected initializeScene(): void {

        this._root  = new THREE.Group();
        this._root.name = ObjectNames.ImageFactoryModelGroup;
        this._root.add(this._modelGroup);

        this._scene = new THREE.Scene();
        this._scene.add(this._root);

        this.initializeLighting(this._scene);
    }

    /**
     * Initialize the  model view.
     */
     protected initializeRenderer() {

        this._renderer = new THREE.WebGLRenderer( {canvas : this._canvas, logarithmicDepthBuffer : this._logDepthBuffer});

        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(this._width, this._height);

        // 3D model scene
        this._target = this.constructRenderTarget();

        // 2D plane scene
        this._postTarget = this.constructPostRenderTarget();

        this.verifyWebGLExtensions();
    }

    /**
     * Initialize default lighting in the scene.
     * Lighting does not affect the image buffer. It is only used if the canvas is made visible.
     */
    protected initializeLighting(scene: THREE.Scene): void {

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff);
        directionalLight1.position.set(1, 1, 1);
        scene.add(directionalLight1);
    }

    /**
     * Perform setup and initialization.
     */
    protected initializePrimary(): void {

        this.initializeScene();
        this.initializeRenderer();
    }

    /**
     * Perform setup and initialization.
     */
    protected initialize(): void {

        this._logger = Services.defaultLogger;
    }

    /**
     * Constructs the primary (3D model) render target.
     */
    protected constructRenderTarget(): THREE.WebGLRenderTarget {

        const renderTarget = new THREE.WebGLRenderTarget(this._width, this._height);

        renderTarget.texture.format           = THREE.RGBAFormat;
        renderTarget.texture.type             = THREE.UnsignedByteType;
        renderTarget.texture.minFilter        = THREE.NearestFilter;
        renderTarget.texture.magFilter        = THREE.NearestFilter;
        renderTarget.texture.generateMipmaps  = false;

        renderTarget.stencilBuffer            = false;

        return renderTarget;
    }

//#endregion

//#region PostProcessing
    /**
     * Constructs the post (2D model) render target.
     */
    protected constructPostRenderTarget(): THREE.WebGLRenderTarget {

        const postTarget = new THREE.WebGLRenderTarget(this._width, this._height);
        return postTarget;
    }

    /**
     * Initialize the shader material used in the post scene.
     */
    protected initializePostMaterial(): THREE.Material {
        return  null;
    }

    /**
     * Perform setup and initialization of the post scene used to create the final image.
     */
    protected initializePostScene(): void {

        this._postRoot  = new THREE.Group();
        this._postRoot.name = ObjectNames.ImageFactoryModelGroup;

        const postMaterial = this.initializePostMaterial();
        const postMeshPlane = new THREE.PlaneGeometry(2, 2);
        const postMeshQuad  = new THREE.Mesh(postMeshPlane, postMaterial);
        postMeshQuad.name   = ObjectNames.ImagePlane;
        this._postRoot.add(postMeshQuad);

        this._postScene = new THREE.Scene();
        this._postScene.add(this._postRoot);

        this.initializePostCamera();
        this.initializeLighting(this._postScene);
    }

    /**
     * Constructs the orthographic camera used in the post scene to create the image.
     */
    protected initializePostCamera() {

        // Setup post processing stage
        const left: number      =  -1;
        const right: number     =   1;
        const top: number       =   1;
        const bottom: number    =  -1;
        const near: number      =   0;
        const far: number       =   1;

        this._postCamera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
    }

    /**
     * Perform setup and initialization.
     */
    protected initializePost(): void {

        this.initializePostScene();
        this.initializePostCamera();
    }
//#endregion

//#region Analysis
    /**
     * Constructs an RGBA string with the byte values of a pixel.
     * @param buffer Unsigned byte raw buffer.
     * @param row Pixel row.
     * @param column Column row.
     */
     protected unsignedBytesToRGBA(buffer: Uint8Array, row: number, column: number): string {

        const offset = (row * this._width) + column;
        const rValue = buffer[offset + 0].toString(16);
        const gValue = buffer[offset + 1].toString(16);
        const bValue = buffer[offset + 2].toString(16);
        const aValue = buffer[offset + 3].toString(16);

        return `#${rValue}${gValue}${bValue} ${aValue}`;
    }

    /**
     * Analyzes a pixel from a render buffer.
     */
    protected analyzeRenderBuffer() {

        const renderBuffer =  new Uint8Array(this._width * this._height * 4).fill(0);
        this._renderer.readRenderTargetPixels(this._target, 0, 0, this._width, this._height, renderBuffer);

        const messageString = `RGBA[0, 0] = ${this.unsignedBytesToRGBA(renderBuffer, 0, 0)}`;
        this._logger.addMessage(messageString, null);
    }

    /**
     * Analyze the render target.
     */
    protected analyzeTargets()  {

        this.analyzeRenderBuffer();
    }

//#endregion
    /**
     * @description Renders the 3D model.
     * @private
     */
    protected renderPrimary(): void {

        this.initializePrimary();

        // override all materials with image shader material
        const material = this.initializeMaterial();
        if (material)
            this._scene.overrideMaterial = material;

        this._renderer.render(this._scene, this._camera.viewCamera, this._target);

        // restore default materials
        this._scene.overrideMaterial = null;
    }

    /**
     * @description Renders the 2D post plane to create the final image.
     * @private
     */
    protected renderPost(): void {

        this.initializePost();

        // (optional) preview image
        this._renderer.render(this._postScene, this._postCamera);

        // generate final image into render target
        this._renderer.render(this._postScene, this._postCamera, this._postTarget);
    }

    /**
     * @description Create an image buffer.
     * @protected
     * @returns {Uint8Array}
     */
    protected createImageBuffer(): Uint8Array {

        const timerTag = Services.timer.mark("ImageBufferFactory.createImageBufferAsync");

        this.renderPrimary();
        this.renderPost();

        // read render buffer to create image array
        const imageBuffer = new Uint8Array(this._width * this._height * 4).fill(0);
        this._renderer.readRenderTargetPixels(this._postTarget, 0, 0, this._width, this._height, imageBuffer);

        this.clearAllAssests();

        Services.timer.logElapsedTime(timerTag);

        return imageBuffer;
    }
}
