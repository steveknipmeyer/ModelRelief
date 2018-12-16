// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto from "Scripts/Api/V1//Models/DtoModels";
import * as THREE from "three";

import { ObjectNames } from "Scripts/Graphics/Graphics";
import {IImageFactoryParameters, ImageFactory} from "Scripts/Graphics/ImageFactory";
import {CameraFactory} from "Scripts/Models/Camera/CameraFactory";
import {NormalMap} from "Scripts/Models/NormalMap/NormalMap";

/**
 * @class
 * NormalMapFactory
 */
export class NormalMapFactory extends ImageFactory {

    // Private
    private _normalMap: NormalMap = null;     // normal map

    /**
     * @constructor
     * @param parameters Initialization parameters (ImageFactoryParameters)
     */
    constructor(parameters?: IImageFactoryParameters) {
        super(parameters);

        this._factoryName = ObjectNames.NormalMapFactory;
    }

//#region Properties
    /**
     * Returns the active (last-generated) NormalMap constructed by the factory.
     * @returns NormalMap
     */
    get normalMap(): NormalMap {
        return this._normalMap;
    }
//#endregion

    /**
     * Create a normal map.
     */
    public async createNormalMapAsync(): Promise<NormalMap> {

        const imageBuffer = this.createImageBuffer();

        const dtoNormalMap = new Dto.NormalMap({

            id          : 0,
            name        : "Unnamed",
            description : "Factory-generated",
            width       : this._width,
            height      : this._height,

            cameraId    : this._camera.id,
        });

        this._normalMap =  await NormalMap.fromDtoModelAsync(dtoNormalMap);
        this._normalMap.rgbArray = imageBuffer;

        // WIP : Assign Model3d.
        // this._normalMap.model3d   =

        // update camera properties from active view camera
        const parameters = {id : this._camera.id};
        this._normalMap.camera = CameraFactory.constructFromViewCamera(parameters, this._camera.viewCamera, this._camera.project);

        return this._normalMap;    }

//#region Initialization
    /**
     * Initialize the shader material used to encode the depth buffer.
     */
    protected initializeMaterial(): THREE.Material {

        const material = new THREE.ShaderMaterial({
            vertexShader:   MR.shaderSource.NormalMapVertexShader,
            fragmentShader: MR.shaderSource.NormalMapFragmentShader,
        });
        return material;
    }
//#endregion

//#region PostProcessing
    /**
     * Initialize the shader material used to encode the depth buffer.
     */
    protected initializePostMaterial(): THREE.Material {

        const postMaterial = new THREE.ShaderMaterial({

            vertexShader:   MR.shaderSource.NormalMapTextureVertexShader,
            fragmentShader: MR.shaderSource.NormalMapTextureFragmentShader,

            uniforms: {
                tNormalMap : { value: this._target.texture },
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
        this._normalMap.analyze();
    }
}



