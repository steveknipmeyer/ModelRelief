﻿// ------------------------------------------------------------------------// 
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

    class Relief {
        factory : DepthBufferFactory;
        mesh    : THREE.Mesh;
    }
*/

"use strict";

import * as THREE               from 'three'
import {DepthBuffer}            from 'DepthBuffer'
import {MathLibrary}            from 'Math'
import {Logger, ConsoleLogger}  from 'Logger'
import {Tools}                  from 'Tools'

export interface DepthBufferFactoryParameters {
    width  : number,
    height : number

    model?           : THREE.Mesh,
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

    static MeshModelName     : string           = 'Model';  // default name for scene mesh
    static DefaultResolution : number           = 1024;     // default DB resolution

    _width           : number                   = DepthBufferFactory.DefaultResolution;     // width resolution of the DB
    _height          : number                   = DepthBufferFactory.DefaultResolution;     // height resolution of the DB

    _logDepthBuffer  : boolean                  = false;    // use a logarithmic buffer for more accuracy in large scenes
    _boundedClipping : boolean                  = true;     // override camera clipping planes; set near and far to bound model for improved accuracy

    _depthBuffer     : DepthBuffer              = null;     // depth buffer 
    _target          : THREE.WebGLRenderTarget  = null;     // WebGL render target for creating the WebGL depth buffer when rendering the scene
    _encodedTarget   : THREE.WebGLRenderTarget  = null;     // WebGL render target for encodin the WebGL depth buffer into a floating point (RGBA format)

    _canvas          : HTMLCanvasElement        = null;     // DOM canvas supporting renderer
    _renderer        : THREE.WebGLRenderer      = null;     // scene renderer

    _scene           : THREE.Scene              = null;     // target scene
    _model           : THREE.Mesh               = null;     // target model
    _camera          : THREE.PerspectiveCamera  = null;     // perspective camera to generate the depth buffer
        
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

        // required
        this._width           = parameters.width;
        this._height          = parameters.height;

        // optional
        this._model           = parameters.model  =          parameters.model           || null;
        this._camera          = parameters.camera =          parameters.camera          || null;
        this._logDepthBuffer  = parameters.logDepthBuffer  = parameters.logDepthBuffer  || false;
        this._boundedClipping = parameters.boundedClipping = parameters.boundedClipping || true;

        this.initialize();
    }

    /**
     * Initialize default lighting in the scene.
     * Lighting does not affect the depth buffer. It is only used if the canvas is made visible.
     */
    initializeLighting () : void {

        let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this._scene.add(ambientLight);

        let directionalLight1 = new THREE.DirectionalLight(0xffffff);
        directionalLight1.position.set(1, 1, 1);
        this._scene.add(directionalLight1);
    }

    /**
     * Adds a background plane at the origin.
     */
    addBackgroundPlane (size : number) {

        // background plane
        let geometry = new THREE.PlaneGeometry(size, size);
        let material = new THREE.MeshPhongMaterial({ color: 0xffffff });

        let mesh = new THREE.Mesh(geometry, material);
        let center = new THREE.Vector3(0.0, 0.0, 0.0);
        mesh.position.set(center.x, center.y, center.z);

        this._scene.add(mesh);
    }

    /**
     * Perform setup and initialization of the render scene.
     */
    initializeScene () : void {
        
        this._scene = new THREE.Scene();
        if (this._model)
            this._scene.add(this._model);

        this.initializeLighting();
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
    }

    /**
     * Perform setup and initialization.
     */
    initialize () : void {

        this._logger = new ConsoleLogger();   
        this.verifyWebGLExtensions();

        this.initializeRenderer();
        this.initializeScene();
        this.initializePostScene();
    }

    /**
     * Verifies the minimum WebGL extensions are present.
     * @param renderer WebGL renderer.
     */
    verifyWebGLExtensions() : boolean {
    
        if (!this._renderer.extensions.get('WEBGL_depth_texture')) {
            this._logger.addErrorMessage('The minimum WebGL extensions are not supported in the browser.');
            return false;
        }

        return true;
    }

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
     * Initialize the  model view.
     */
     initializeRenderer() {

        this._canvas = this.initializeCanvas();
        this._renderer = new THREE.WebGLRenderer( {canvas : this._canvas, logarithmicDepthBuffer : this._logDepthBuffer});
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(this._width, this._height);

        // Model Scene -> (Render Texture, Depth Texture)
        this._target = this.constructDepthTextureRenderTarget();

        // Encoded RGBA Texture from Depth Texture
        this._encodedTarget = new THREE.WebGLRenderTarget(this._width, this._height);
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
     * Generates a mesh from the active model and camera
     * @param parameters Generation parameters (MeshGenerateParameters)
     */
    meshGenerate (parameters : MeshGenerateParameters) : THREE.Mesh {

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

    /**
     * Model setter
     * @param model Active mesh in the DBF
     */
    set model(model :THREE.Mesh) {

        this._model = model;

        let previousMesh : THREE.Mesh = <THREE.Mesh> this._scene.getObjectByName(DepthBufferFactory.MeshModelName);
        if (!previousMesh) {
            this._logger.addErrorMessage ('Model mesh not found in scene.');
            return;
         }      

         this._scene.remove(previousMesh);
         previousMesh.geometry.dispose();
         previousMesh.material.dispose();
        
         this._scene.add(this._model);
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
    }
}
