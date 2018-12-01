// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto from "Scripts/Api/V1//Models/DtoModels";
import * as THREE from "three";

import {BaseCamera} from "Scripts/Models/Camera/BaseCamera";
import {CameraFactory} from "Scripts/Models/Camera/CameraFactory";
import {DepthBuffer} from "Scripts/Models/DepthBuffer/DepthBuffer";
import {DepthBufferFactorySettings} from "Scripts/Models/DepthBuffer/DepthBufferFactorySettings";
import {ILogger} from "Scripts/System/Logger";
import {Services} from "Scripts/System/Services";
import {Tools} from "Scripts/System/Tools";

/*
  Requirements
    Fixed resolution; resizing support is not required.
*/
/**
 * @description Constructor parameters for DepthBufferFactory.
 * @export
 * @interface DepthBufferFactoryParameters
 */
export interface IDepthBufferFactoryParameters {

    canvas: HTMLCanvasElement;       // Canvas element (any size)
    width: number;                   // width of DB
    height: number;                  // height of DB
    modelGroup: THREE.Group;         // model root
    camera: BaseCamera;              // camera

    logDepthBuffer?: boolean;        // use logarithmic depth buffer for higher resolution (better distribution) in scenes with large extents
}

/**
 * @class
 * DepthBufferFactory
 */
export class DepthBufferFactory {

    public static CssClassName: string              = "DepthBufferFactory";     // CSS class
    public static RootContainerId: string           = "rootContainer";          // root container for viewers

    public _scene: THREE.Scene                      = null;     // target scene
    public _modelGroup: THREE.Group                 = null;     // target model

    public _renderer: THREE.WebGLRenderer           = null;     // scene renderer
    public _canvas: HTMLCanvasElement               = null;     // DOM canvas supporting renderer
    public _width: number                           = DepthBufferFactorySettings.DefaultResolution;     // width resolution of the DB
    public _height: number                          = DepthBufferFactorySettings.DefaultResolution;     // height resolution of the DB

    public _camera: BaseCamera                      = null;     // camera to generate the depth buffer


    public _logDepthBuffer: boolean                 = false;    // use a logarithmic buffer for more accuracy in large scenes

    public _depthBuffer: DepthBuffer                = null;     // depth buffer
    public _target: THREE.WebGLRenderTarget         = null;     // WebGL render target for creating the WebGL depth buffer when rendering the scene
    public _encodedTarget: THREE.WebGLRenderTarget  = null;     // WebGL render target for encodin the WebGL depth buffer into a floating point (RGBA format)

    public _postScene: THREE.Scene                  = null;     // single polygon scene use to generate the encoded RGBA buffer
    public _postCamera: THREE.OrthographicCamera    = null;     // orthographic camera
    public _postMaterial: THREE.ShaderMaterial      = null;     // shader material that encodes the WebGL depth buffer into a floating point RGBA format

    public _minimumWebGL: boolean                   = true;     // true if minimum WeGL requirements are present
    public _logger: ILogger                         = null;     // logger

    private _debug: boolean                         = true;

    /**
     * @constructor
     * @param parameters Initialization parameters (DepthBufferFactoryParameters)
     */
    constructor(parameters?: IDepthBufferFactoryParameters) {

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
        this._modelGroup      = modelGroup.clone(true);
        this._camera          = camera;

        // optional
        this._logDepthBuffer  = logDepthBuffer;

        this._canvas = this.initializeCanvas();
        this.initialize();
    }

//#region Properties
    /**
     * Returns the active canvasof the factory.
     * @returns HTMLElement
     */
    get canvas(): HTMLElement {
        return this._canvas;
    }

    /**
     * Returns the active (last-generated) DepthBuffer constructed by the factory.
     * @returns DepthBuffer
     */
    get depthBuffer(): DepthBuffer {
        return this._depthBuffer;
    }
//#endregion

//#region Initialization
    /**
     * Verifies the minimum WebGL extensions are present.
     * @param renderer WebGL renderer.
     */
    public verifyWebGLExtensions(): boolean {

        if (!this._renderer.extensions.get("WEBGL_depth_texture")) {
            this._minimumWebGL = false;
            this._logger.addErrorMessage("The minimum WebGL extensions are not supported in the browser.");
            return false;
        }

        return true;
    }

    /**
     * Constructs a WebGL target canvas.
     */
    public initializeCanvas(): HTMLCanvasElement {

        this._canvas.setAttribute("name", Tools.generatePseudoGUID());
        this._canvas.setAttribute("class", DepthBufferFactory.CssClassName);

        // render dimensions
        this._canvas.width  = this._width;
        this._canvas.height = this._height;

        // DOM element dimensions (may be different than render dimensions)
        this._canvas.style.width  = `${this._width}px`;
        this._canvas.style.height = `${this._height}px`;

        return this._canvas;
    }

    /**
     * Perform setup and initialization of the render scene.
     */
    public initializeScene(): void {

        this._scene = new THREE.Scene();
        if (this._modelGroup)
            this._scene.add(this._modelGroup);

        this.initializeLighting(this._scene);
    }

    /**
     * Initialize the  model view.
     */
     public initializeRenderer() {

        this._renderer = new THREE.WebGLRenderer( {canvas : this._canvas, logarithmicDepthBuffer : this._logDepthBuffer});
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(this._width, this._height);

        // Model Scene -> (Render Texture, Depth Texture)
        this._target = this.constructDepthTextureRenderTarget();

        // Encoded RGBA Texture from Depth Texture
        this._encodedTarget = new THREE.WebGLRenderTarget(this._width, this._height);

        this.verifyWebGLExtensions();
    }

    /**
     * Initialize default lighting in the scene.
     * Lighting does not affect the depth buffer. It is only used if the canvas is made visible.
     */
    public initializeLighting(scene: THREE.Scene): void {

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff);
        directionalLight1.position.set(1, 1, 1);
        scene.add(directionalLight1);
    }

    /**
     * Perform setup and initialization.
     */
    public initializePrimary(): void {

        this.initializeScene();
        this.initializeRenderer();
    }

    /**
     * Perform setup and initialization.
     */
    public initialize(): void {

        this._logger = Services.defaultLogger;

        this.initializePrimary();
        this.initializePost();
    }
//#endregion

//#region PostProcessing
    /**
     * Constructs a render target <with a depth texture buffer>.
     */
    public constructDepthTextureRenderTarget(): THREE.WebGLRenderTarget {

        // Model Scene -> (Render Texture, Depth Texture)
        const renderTarget = new THREE.WebGLRenderTarget(this._width, this._height);

        renderTarget.texture.format           = THREE.RGBAFormat;
        renderTarget.texture.type             = THREE.UnsignedByteType;
        renderTarget.texture.minFilter        = THREE.NearestFilter;
        renderTarget.texture.magFilter        = THREE.NearestFilter;
        renderTarget.texture.generateMipmaps  = false;

        renderTarget.stencilBuffer            = false;

        renderTarget.depthBuffer              = true;
        renderTarget.depthTexture             = new THREE.DepthTexture(this._width, this._height);
        renderTarget.depthTexture.type        = THREE.UnsignedIntType;

        return renderTarget;
    }

    /**
     * Perform setup and initialization of the post scene used to create the final RGBA encoded depth buffer.
     */
    public initializePostScene(): void {

        const postMeshMaterial = new THREE.ShaderMaterial({

            vertexShader:   MR.shaderSource.DepthBufferVertexShader,
            fragmentShader: MR.shaderSource.DepthBufferFragmentShader,

            uniforms: {
                cameraNear  :   { value: this._camera.viewCamera.near },
                cameraFar   :   { value: this._camera.viewCamera.far },
                tDiffuse    :   { value: this._target.texture },
                tDepth      :   { value: this._target.depthTexture },
            },
        });
        const postMeshPlane = new THREE.PlaneGeometry(2, 2);
        const postMeshQuad  = new THREE.Mesh(postMeshPlane, postMeshMaterial);

        this._postScene = new THREE.Scene();
        this._postScene.add(postMeshQuad);

        this.initializePostCamera();
        this.initializeLighting(this._postScene);
    }

    /**
     * Constructs the orthographic camera used to convert the WebGL depth buffer to the encoded RGBA buffer
     */
    public initializePostCamera() {

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
    public initializePost(): void {

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
     public unsignedBytesToRGBA(buffer: Uint8Array, row: number, column: number): string {

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
    public analyzeRenderBuffer() {

        const renderBuffer =  new Uint8Array(this._width * this._height * 4).fill(0);
        this._renderer.readRenderTargetPixels(this._target, 0, 0, this._width, this._height, renderBuffer);

        const messageString = `RGBA[0, 0] = ${this.unsignedBytesToRGBA(renderBuffer, 0, 0)}`;
        this._logger.addMessage(messageString, null);
    }

    /**
     * Analyze the render and depth targets.
     */
    public analyzeTargets()  {

        this.analyzeRenderBuffer();
        this._depthBuffer.analyze();
    }
//#endregion

    /**
     * Create a depth buffer.
     */
    public async createDepthBufferAsync(): Promise<DepthBuffer> {

        const timerTag = Services.timer.mark("DepthBufferFactory.createDepthBuffer");

        this._renderer.render(this._scene, this._camera.viewCamera, this._target);

        // (optional) preview encoded RGBA texture; drawn by shader but not persisted
        this._renderer.render(this._postScene, this._postCamera);

        // Persist encoded RGBA texture; calculated from depth buffer
        // encodedTarget.texture      : encoded RGBA texture
        // encodedTarget.depthTexture : null
        this._renderer.render(this._postScene, this._postCamera, this._encodedTarget);

        // decode RGBA texture into depth floats
        const depthBufferRGBA =  new Uint8Array(this._width * this._height * 4).fill(0);
        this._renderer.readRenderTargetPixels(this._encodedTarget, 0, 0, this._width, this._height, depthBufferRGBA);

        const dtoDepthBuffer = new Dto.DepthBuffer({

            id          : 0,
            name        : "Unnamed",
            description : "Factory-generated",
            width       : this._width,
            height      : this._height,

            cameraId    : this._camera.id,
        });

        this._depthBuffer =  await DepthBuffer.fromDtoModelAsync(dtoDepthBuffer);
        this._depthBuffer.rgbArray = depthBufferRGBA;

        // WIP : Assign Model3d.
        // this._depthBuffer.model3d   =

        // update camera properties from active view camera
        const parameters = {id : this._camera.id};
        this._depthBuffer.camera = CameraFactory.constructFromViewCamera(parameters, this._camera.viewCamera, this._camera.project);

        if (this._debug)
            this.analyzeTargets();

        Services.timer.logElapsedTime(timerTag);
        return this._depthBuffer;
    }
}

