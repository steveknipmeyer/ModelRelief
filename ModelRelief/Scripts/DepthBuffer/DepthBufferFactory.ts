// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
/*
  Requirements
    No persistent DOM element. The canvas is created dynamically.
        Option for persisting the Factory in the constructor
    JSON compatible constructor parameters
    Fixed resolution; resizing support is not required.
*/

"use strict";

import * as THREE               from 'three'

import {Camera}                 from 'Camera'
import {DepthBuffer}            from 'DepthBuffer'
import {Graphics}               from 'Graphics'
import {Logger, ConsoleLogger}  from 'Logger'
import {MathLibrary}            from 'Math'
import {ModelRelief}            from 'ModelRelief'
import {Services}               from 'Services'
import {Tools}                  from 'Tools'

export interface DepthBufferFactoryParameters {

    width            : number,
    height           : number
    model            : THREE.Group,

    camera?          : THREE.PerspectiveCamera,
    logDepthBuffer?  : boolean
    boundedClipping? : boolean
}

export interface MeshGenerateParameters {

    modelWidth       : number;
    camera?          : THREE.PerspectiveCamera;
    material?        : THREE.Material;
}

export interface ImageGenerateParameters {
}

/**
 * @class
 * DepthBufferFactory
 */
export class DepthBufferFactory {

    static DefaultResolution : number           = 1024;     // default DB resolution

    _scene           : THREE.Scene              = null;     // target scene
    _model           : THREE.Group              = null;     // target model

    _renderer        : THREE.WebGLRenderer      = null;     // scene renderer
    _canvas          : HTMLCanvasElement        = null;     // DOM canvas supporting renderer
    _width           : number                   = DepthBufferFactory.DefaultResolution;     // width resolution of the DB
    _height          : number                   = DepthBufferFactory.DefaultResolution;     // height resolution of the DB

    _camera          : THREE.PerspectiveCamera  = null;     // perspective camera to generate the depth buffer


    _logDepthBuffer  : boolean                  = false;    // use a logarithmic buffer for more accuracy in large scenes
    _boundedClipping : boolean                  = true;     // override camera clipping planes; set near and far to bound model for improved accuracy

    _depthBuffer     : DepthBuffer              = null;     // depth buffer 
    _target          : THREE.WebGLRenderTarget  = null;     // WebGL render target for creating the WebGL depth buffer when rendering the scene
    _encodedTarget   : THREE.WebGLRenderTarget  = null;     // WebGL render target for encodin the WebGL depth buffer into a floating point (RGBA format)

    _postScene       : THREE.Scene              = null;     // single polygon scene use to generate the encoded RGBA buffer
    _postCamera      : THREE.OrthographicCamera = null;     // orthographic camera
    _postMaterial    : THREE.ShaderMaterial     = null;     // shader material that encodes the WebGL depth buffer into a floating point RGBA format

    _minimumWebGL    : boolean                  = true;     // true if minimum WeGL requirementat are present
    _logger          : Logger                   = null;     // logger

    /**
     * @constructor
     * @param parameters Initialization parameters (DepthBufferFactoryParameters)
     */
    constructor(parameters : DepthBufferFactoryParameters) {

        this._canvas = this.initializeCanvas();

        // required
        this._width           = parameters.width;
        this._height          = parameters.height;
        this._model           = parameters.model.clone();

        // optional
        this._camera          = parameters.camera          || null;
        this._logDepthBuffer  = parameters.logDepthBuffer  || false;
        this._boundedClipping = parameters.boundedClipping || true;

        this.initialize();
    }


//#region Properties
//#endregion

//#region Initialization    
    /**
     * Verifies the minimum WebGL extensions are present.
     * @param renderer WebGL renderer.
     */
    verifyWebGLExtensions() : boolean {
    
        if (!this._renderer.extensions.get('WEBGL_depth_texture')) {
            this._minimumWebGL = false;
            this._logger.addErrorMessage('The minimum WebGL extensions are not supported in the browser.');
            return false;
        }

        return true;
    }

    /**
     * Constructs a WebGL target canvas.
     */
    initializeCanvas() : HTMLCanvasElement {
    
        this._canvas = document.createElement('canvas');
        this._canvas.setAttribute('name', Tools.generatePseudoGUID());

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
    initializeScene () : void {
        
        this._scene = new THREE.Scene();
        if (this._model)
            this._scene.add(this._model);

        this.initializeLighting(this._scene);
    }

    /**
     * Initialize the  model view.
     */
     initializeRenderer() {

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
    initializeLighting (scene : THREE.Scene) : void {

        let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);

        let directionalLight1 = new THREE.DirectionalLight(0xffffff);
        directionalLight1.position.set(1, 1, 1);
        scene.add(directionalLight1);
    }

    /**
     * Perform setup and initialization.
     */
    initializePrimary () : void {

        this.initializeScene();
        this.initializeRenderer();
    }

    /**
     * Perform setup and initialization.
     */
    initialize () : void {

        this._logger = Services.consoleLogger;
        
        this.initializePrimary();
        this.initializePost();
    }
//#endregion

//#region PostProcessing
    /**
     * Constructs a render target <with a depth texture buffer>.
     */
    constructDepthTextureRenderTarget() : THREE.WebGLRenderTarget {

        // Model Scene -> (Render Texture, Depth Texture)
        let renderTarget = new THREE.WebGLRenderTarget(this._width, this._height);

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
    initializePostScene () : void {

        let postMeshMaterial = new THREE.ShaderMaterial({
        
            vertexShader:   MR.shaderSource['DepthBufferVertexShader'],
            fragmentShader: MR.shaderSource['DepthBufferFragmentShader'],

            uniforms: {
                cameraNear  :   { value: this._camera.near },
                cameraFar   :   { value: this._camera.far },
                tDiffuse    :   { value: this._target.texture },
                tDepth      :   { value: this._target.depthTexture }
            }
        });
        let postMeshPlane = new THREE.PlaneGeometry(2, 2);
        let postMeshQuad  = new THREE.Mesh(postMeshPlane, postMeshMaterial);

        this._postScene = new THREE.Scene();
        this._postScene.add(postMeshQuad);

        this.initializePostCamera();
        this.initializeLighting(this._postScene);
    }

    /**
     * Constructs the orthographic camera used to convert the WebGL depth buffer to the encoded RGBA buffer
     */
    initializePostCamera() {

        // Setup post processing stage
        let left: number      =  -1;
        let right: number     =   1;
        let top: number       =   1;
        let bottom: number    =  -1;
        let near: number      =   0;
        let far: number       =   1;

        this._postCamera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
    }

    /**
     * Perform setup and initialization.
     */
    initializePost () : void {

        this.initializePostScene();
        this.initializePostCamera();
    }
//#endregion

//#region Generation
    /**
     * Verifies the pre-requisite settings are defined to create a mesh.
     */
    verifyMeshSettings(): boolean {

        let minimumSettings : boolean = true
        let errorPrefix     : string = 'DepthBufferFactory: ';

        if (!this._model) {
            this._logger.addErrorMessage(`${errorPrefix}The model is not defined.`);
            minimumSettings = false;
        }

        if (!this._camera) {
            this._logger.addErrorMessage(`${errorPrefix}The camera is not defined.`);
            minimumSettings = false;
        }

        return minimumSettings;
    }

    /**
     * Constructs an RGBA string with the byte values of a pixel.
     * @param buffer Unsigned byte raw buffer.
     * @param row Pixel row.
     * @param column Column row.
     */
     unsignedBytesToRGBA (buffer : Uint8Array, row : number, column : number) : string {
        
        let offset = (row * this._width) + column;
        let rValue = buffer[offset + 0].toString(16);
        let gValue = buffer[offset + 1].toString(16);
        let bValue = buffer[offset + 2].toString(16);
        let aValue = buffer[offset + 3].toString(16);

        return `#${rValue}${gValue}${bValue} ${aValue}`;
    }

    /**
     * Analyzes a pixel from a render buffer.
     */
    analyzeRenderBuffer () {

        let renderBuffer =  new Uint8Array(this._width * this._height * 4).fill(0);
        this._renderer.readRenderTargetPixels(this._target, 0, 0, this._width, this._height, renderBuffer);

        let messageString = `RGBA[0, 0] = ${this.unsignedBytesToRGBA(renderBuffer, 0, 0)}`;
        this._logger.addMessage(messageString, null);
    }

    /**
     * Analyze the render and depth targets.
     */
    analyzeTargets ()  {

//      this.analyzeRenderBuffer();
        this._depthBuffer.analyze();
    }

    /**
     * Create a depth buffer.
     */
    createDepthBuffer() {

        this._renderer.render(this._scene, this._camera, this._target);    
    
        // (optional) preview encoded RGBA texture; drawn by shader but not persisted
        this._renderer.render(this._postScene, this._postCamera);    

        // Persist encoded RGBA texture; calculated from depth buffer
        // encodedTarget.texture      : encoded RGBA texture
        // encodedTarget.depthTexture : null
        this._renderer.render(this._postScene, this._postCamera, this._encodedTarget); 

        // decode RGBA texture into depth floats
        let depthBufferRGBA =  new Uint8Array(this._width * this._height * 4).fill(0);
        this._renderer.readRenderTargetPixels(this._encodedTarget, 0, 0, this._width, this._height, depthBufferRGBA);

        this._depthBuffer = new DepthBuffer(depthBufferRGBA, this._width, this._height, this._camera);    

        this.analyzeTargets();
    }
    /**
     * Sets the camera clipping planes for mesh generation.
     */
    setCameraClippingPlanes () {

        // copy camera; shared with ModelViewer
        let camera = new THREE.PerspectiveCamera();
        camera.copy (this._camera);
        this._camera = camera;

        let cameraMatrixWorldInverse : THREE.Matrix4 = this._camera.matrixWorldInverse;

        // clone model (and geometry!)
        let modelView       =  Graphics.cloneAndTransformObject(this._model, cameraMatrixWorldInverse);
        let boundingBoxView = Graphics.getBoundingBoxFromObject(modelView);

        // The bounding box is world-axis aligned. 
        // In View coordinates, the camera is at the origin.
        // The bounding near plane is the maximum Z of the bounding box.
        // The bounding far plane is the minimum Z of the bounding box.
        let nearPlane = -boundingBoxView.max.z;
        let farPlane  = -boundingBoxView.min.z;

        this._camera.near = nearPlane;
        this._camera.far  = farPlane;

        // WIP: Or this._viewer.updateCamera()?
        this._camera.updateProjectionMatrix();
   }

    /**
     * Generates a mesh from the active model and camera
     * @param parameters Generation parameters (MeshGenerateParameters)
     */
    meshGenerate (parameters : MeshGenerateParameters) : THREE.Mesh {
        
        if (!this.verifyMeshSettings()) 
            return null;

        this.setCameraClippingPlanes();

        this.createDepthBuffer();
        let mesh = this._depthBuffer.mesh(parameters.modelWidth, parameters.material);

        return mesh;
    }

    /**
     * Generates an image from the active model and camera
     * @param parameters Generation parameters (ImageGenerateParameters)
     */
    imageGenerate (parameters : ImageGenerateParameters) : Uint8Array {

        return null;
    }
//#endregion
}

