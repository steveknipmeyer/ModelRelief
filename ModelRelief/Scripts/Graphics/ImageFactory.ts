// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE from "three";

import {Graphics, ObjectNames} from "Scripts/Graphics/Graphics";
import {ImageFactorySettings} from "Scripts/Graphics/ImageFactorySettings";
import {BaseCamera} from "Scripts/Models/Camera/BaseCamera";
import {Image} from "Scripts/System/Image";
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
    protected _factoryName: string                     = "";       // factory name

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
        this._modelGroup      = Graphics.cloneAndTransformObject(modelGroup) as THREE.Group;
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
//#endregion

    /**
     * @description Removes all scene objects
     */
    public clearAllAssests(): void {

        Graphics.removeObjectChildren(this._root, false);
        Graphics.removeObjectChildren(this._postRoot, false);

        this._target.dispose();
        this._postTarget.dispose();

        Graphics.resetWebGLVertexAttributes(this._renderer);
    }

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
     * Initialize the renderer.
     */
    protected constructRenderer(): THREE.WebGLRenderer {

        const renderer = new THREE.WebGLRenderer({

            logarithmicDepthBuffer  : false,
            canvas                  : this._canvas,
            antialias               : true,
            preserveDrawingBuffer   : true,
        });
        renderer.autoClear = true;
        renderer.setClearColor(0x000000);

        return renderer;
    }

    /**
     * Initialize the  model view.
     */
    protected initializeRenderer(): void {

        this._renderer = this.constructRenderer();

        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(this._width, this._height);

        // 3D model scene
        this._target = this.constructRenderTarget();

        // 2D plane scene
        this._postTarget = this.constructPostRenderTarget();

        // this.verifyWebGLExtensions();
    }

    /**
     * Constructs the default render target.
     */
    protected constructDefaultRenderTarget(): THREE.WebGLRenderTarget {

        const renderTarget = new THREE.WebGLRenderTarget(this._width, this._height);

        renderTarget.texture.format      = THREE.RGBAFormat;
        renderTarget.texture.minFilter   = THREE.LinearFilter;
        renderTarget.texture.magFilter   = THREE.NearestFilter;

        renderTarget.stencilBuffer       = false;

        // N.B. Depth buffer must be enabled or polygon depth tests are not done.
        // https://github.com/mrdoob/three.js/issues/11783
        renderTarget.depthBuffer        = true;
        renderTarget.depthTexture       = new THREE.DepthTexture(this._width, this._height);
        renderTarget.depthTexture.type  = THREE.UnsignedIntType;

        return renderTarget;
    }

    /**
     * Constructs the primary (3D model) render target.
     */
    protected constructRenderTarget(): THREE.WebGLRenderTarget {

        const renderTarget = this.constructDefaultRenderTarget();

        return renderTarget;
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
//#endregion

//#region PostProcessing
    /**
     * Constructs the post (2D model) render target.
     */
    protected constructPostRenderTarget(): THREE.WebGLRenderTarget {

        const postTarget = this.constructDefaultRenderTarget();

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

        const postPlaneMaterial  = this.initializePostMaterial();
        const postPlaneGeometry = new THREE.PlaneGeometry(2, 2);
        const postPlane  = new THREE.Mesh(postPlaneGeometry, postPlaneMaterial);
        postPlane.name   = ObjectNames.ImagePlane;

        this._postRoot.add(postPlane);
        this._postScene = new THREE.Scene();
        this._postScene.add(this._postRoot);

        this.initializePostCamera();
        this.initializeLighting(this._postScene);
    }

    /**
     * Constructs the orthographic camera used in the post scene to create the image.
     */
    protected initializePostCamera(): void {

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

//#region Target Buffers
    /**
     * Read a render target.
     */
    protected readRenderTarget(theTarget: THREE.WebGLRenderTarget): Uint8Array {

        const buffer = new Uint8Array(this._width * this._height * Image.RGBASize).fill(0);
        this._renderer.readRenderTargetPixels(theTarget, 0, 0, this._width, this._height, buffer);

        return buffer;
    }

    /**
     * Read the primary render target.
     */
    protected readTarget(): Uint8Array {
        return this.readRenderTarget(this._target);
    }

    /**
     * Read the post render target.
     */
    protected readPostTarget(): Uint8Array {
        return this.readRenderTarget(this._postTarget);
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

        this._renderer.setRenderTarget(this._target);
        this._renderer.clear();
        this._renderer.render(this._scene, this._camera.viewCamera);
        this._renderer.setRenderTarget(null);

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
        this._renderer.setRenderTarget(this._postTarget);
        this._renderer.clear();
        this._renderer.render(this._postScene, this._postCamera);
        this._renderer.setRenderTarget(null);
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
        const imageBuffer = new Uint8Array(this._width * this._height * Image.RGBASize).fill(0);
        this._renderer.readRenderTargetPixels(this._postTarget, 0, 0, this._width, this._height, imageBuffer);

        this.clearAllAssests();

        Services.timer.logElapsedTime(timerTag);

        return imageBuffer;
    }
}
