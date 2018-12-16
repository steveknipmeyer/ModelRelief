// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto from "Scripts/Api/V1//Models/DtoModels";
import * as THREE from "three";

import {ObjectNames} from "Scripts/Graphics/Graphics";
import {IImageFactoryParameters, ImageFactory} from "Scripts/Graphics/ImageFactory";
import {CameraFactory} from "Scripts/Models/Camera/CameraFactory";
import {DepthBuffer} from "Scripts/Models/DepthBuffer/DepthBuffer";

/**
 * @class
 * DepthBufferFactory
 */
export class DepthBufferFactory extends ImageFactory {

    // Private
    private _depthBuffer: DepthBuffer = null;     // depth buffer

    /**
     * @constructor
     * @param parameters Initialization parameters (ImageFactoryParameters)
     */
    constructor(parameters?: IImageFactoryParameters) {
        super(parameters);

        this._factoryName = ObjectNames.DepthBufferFactory;
        this._minimumWebGLExtensions = ["WEBGL_depth_texture"];
    }

//#region Properties
    /**
     * Returns the active (last-generated) DepthBuffer constructed by the factory.
     * @returns DepthBuffer
     */
    get depthBuffer(): DepthBuffer {
        return this._depthBuffer;
    }
//#endregion

    /**
     * Create a depth buffer.
     */
    public async createDepthBufferAsync(): Promise<DepthBuffer> {

        const imageBuffer = this.createImageBuffer();

        const dtoDepthBuffer = new Dto.DepthBuffer({

            id          : 0,
            name        : "Unnamed",
            description : "Factory-generated",
            width       : this._width,
            height      : this._height,

            cameraId    : this._camera.id,
        });

        this._depthBuffer =  await DepthBuffer.fromDtoModelAsync(dtoDepthBuffer);
        this._depthBuffer.rgbArray = imageBuffer;

        // WIP : Assign Model3d.
        // this._depthBuffer.model3d   =

        // update camera properties from active view camera
        const parameters = {id : this._camera.id};
        this._depthBuffer.camera = CameraFactory.constructFromViewCamera(parameters, this._camera.viewCamera, this._camera.project);

        if (this._debug)
            this.analyzeTargets();

        return this._depthBuffer;
    }

//#region Initialization
    /**
     * Initialize the renderer.
     */
    protected constructRenderer(): THREE.WebGLRenderer {

        const renderer = new THREE.WebGLRenderer( {canvas : this._canvas, logarithmicDepthBuffer : this._logDepthBuffer, preserveDrawingBuffer: true});

        return renderer;
    }

    /**
     * Constructs the primary (3D model) render target.
     */
    protected constructRenderTarget(): THREE.WebGLRenderTarget {

        const  target: THREE.WebGLRenderTarget = super.constructRenderTarget();

        target.depthBuffer        = true;
        target.depthTexture       = new THREE.DepthTexture(this._width, this._height);
        target.depthTexture.type  = THREE.UnsignedIntType;

        return target;
    }

//#endregion

//#region PostProcessing
    /**
     * Initialize the shader material used to encode the depth buffer.
     */
    protected initializePostMaterial(): THREE.Material {

        const postMaterial = new THREE.ShaderMaterial({

            vertexShader:   MR.shaderSource.DepthBufferVertexShader,
            fragmentShader: MR.shaderSource.DepthBufferFragmentShader,

            uniforms: {
                cameraNear  :   { value: this._camera.viewCamera.near },
                cameraFar   :   { value: this._camera.viewCamera.far },
                tDepth      :   { value: this._target.depthTexture },
            },
        });

        return postMaterial;
    }
//#endregion

//#region Analysis

    /**
     * Analyze the render and depth targets.
     */
    protected analyzeTargets()  {

        super.analyzeRenderBuffer();
        this._depthBuffer.analyze();
    }
}
