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
import {NormalMap} from "Scripts/Models/NormalMap/NormalMap";
import {NormalMapFactorySettings} from "Scripts/Models/NormalMap/NormalMapFactorySettings";
import {ILogger} from "Scripts/System/Logger";
import {Services} from "Scripts/System/Services";
import {Tools} from "Scripts/System/Tools";

/*
  Requirements
    Fixed resolution; resizing support is not required.
*/
/**
 * @description Constructor parameters for NormalMapFactory.
 * @export
 * @interface INormalMapFactoryParameters
 */
export interface INormalMapFactoryParameters {

    canvas: HTMLCanvasElement;       // Canvas element (any size)
    width: number;                   // width of DB
    height: number;                  // height of DB
    modelGroup: THREE.Group;         // model root
    camera: BaseCamera;              // camera
}

/**
 * @class
 * NormalMapFactory
 */
export class NormalMapFactory {

    public static CssClassName: string              = "NormalMapFactory";       // CSS class
    public static RootContainerId: string           = "rootContainer";          // root container for viewers

    public _scene: THREE.Scene                      = null;     // target scene
    public _modelGroup: THREE.Group                 = null;     // target model

    public _renderer: THREE.WebGLRenderer           = null;     // scene renderer
    public _canvas: HTMLCanvasElement               = null;     // DOM canvas supporting renderer
    public _width: number                           = NormalMapFactorySettings.DefaultResolution;     // width resolution of the DB
    public _height: number                          = NormalMapFactorySettings.DefaultResolution;     // height resolution of the DB

    public _camera: BaseCamera                      = null;     // camera to generate the depth buffer

    public _normalMap: NormalMap                    = null;     // normal map

    public _minimumWebGL: boolean                   = true;     // true if minimum WeGL requirements are present
    public _logger: ILogger                         = null;     // logger

    private _debug: boolean                         = true;

    /**
     * @constructor
     * @param parameters Initialization parameters (NormalMapFactoryParameters)
     */
    constructor(parameters?: INormalMapFactoryParameters) {

        const {
            // required
            canvas,
            width,
            height,
            modelGroup,
            camera,

        } = parameters;

        this._canvas          = canvas;
        this._width           = width;
        this._height          = height;
        this._modelGroup      = modelGroup.clone(true);
        this._camera          = camera;

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
     * Returns the active (last-generated) NormalMap constructed by the factory.
     * @returns NormalMap
     */
    get normalMap(): NormalMap {
        return this._normalMap;
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
        this._canvas.setAttribute("class", NormalMapFactory.CssClassName);

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

        this._renderer = new THREE.WebGLRenderer( {canvas : this._canvas});
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(this._width, this._height);

        this.verifyWebGLExtensions();
    }

    /**
     * Initialize default lighting in the scene.
     * Lighting does not affect the normal map. It is only used if the canvas is made visible.
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
    public initialize(): void {

        this._logger = Services.defaultLogger;
    }
//#endregion

//#region PostProcessing
//#endregion

//#region Analysis
//#endregion

    /**
     * Create a depth buffer.
     */
    public async createNormalMapAsync(): Promise<NormalMap> {

        const timerTag = Services.timer.mark("NormalMapFactory.createNormalMap");

        const normalMapElements =  new Float32Array(this._width * this._height).fill(0);

        const dtoNormalMap = new Dto.NormalMap({

            id          : 0,
            name        : "Unnamed",
            description : "Factory-generated",
            width       : this._width,
            height      : this._height,

            cameraId    : this._camera.id,
        });

        this._normalMap =  await NormalMap.fromDtoModelAsync(dtoNormalMap);
        this._normalMap.elements = normalMapElements;

        // WIP : Assign Model3d.
        // this._normalMap.model3d   =

        // update camera properties from active view camera
        const parameters = {id : this._camera.id};
        this._normalMap.camera = CameraFactory.constructFromViewCamera(parameters, this._camera.viewCamera, this._camera.project);

        Services.timer.logElapsedTime(timerTag);
        return this._normalMap;
    }
}

