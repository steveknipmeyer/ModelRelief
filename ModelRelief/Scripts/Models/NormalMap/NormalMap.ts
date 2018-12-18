// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto from "Scripts/Api/V1//Models/DtoModels";
import * as THREE from "three";

import {assert} from "chai";
import {IGeneratedFileModel} from "Scripts/Api/V1/Interfaces/IGeneratedFileModel";
import {NormalMapFormat} from "Scripts/Api/V1/Interfaces/INormalMap";
import {GeneratedFileModel} from "Scripts/Api/V1/Models/GeneratedFileModel";
import {BaseCamera} from "Scripts/Models/Camera/BaseCamera";
import {CameraFactory} from "Scripts/Models/Camera/CameraFactory";
import {IImageModel} from "Scripts/Models/Interfaces/IImageModel";
import {Model3d} from "Scripts/Models/Model3d/Model3d";
import {Project} from "Scripts/Models/Project/Project";

/**
 * @description Represents a normal map.
 * @export
 * @class NormalMap
 * @extends {GeneratedFileModel}
 */
export class NormalMap extends GeneratedFileModel implements IImageModel {

    /**
     * @description Returns a NormalMap instance through an HTTP query of the Id.
     * @static
     * @param {number} id NormalMap Id.
     * @returns {Promise<NormalMap>}
     */
    public static async fromIdAsync(id: number ): Promise<NormalMap> {

        if (!id)
            return undefined;

        const normalMap = new Dto.NormalMap ({
            id,
        });
        const normalMapModel = await normalMap.getAsync();
        return NormalMap.fromDtoModelAsync(normalMapModel);
    }

    /**
     * @description Constructs an instance from a DTO model.
     * @returns {NormalMap}
     */
    public static async fromDtoModelAsync(dtoNormalMap: Dto.NormalMap): Promise<NormalMap> {

        // constructor
        const normalMap = new NormalMap({
            id          : dtoNormalMap.id,
            name        : dtoNormalMap.name,
            description : dtoNormalMap.description,
        });

        normalMap.fileTimeStamp      = dtoNormalMap.fileTimeStamp;
        normalMap.fileIsSynchronized = dtoNormalMap.fileIsSynchronized;

        normalMap.width  = dtoNormalMap.width;
        normalMap.height = dtoNormalMap.height;
        normalMap.format = dtoNormalMap.format;

        normalMap.project = await Project.fromIdAsync(dtoNormalMap.projectId);
        normalMap.model3d = await Model3d.fromIdAsync(dtoNormalMap.model3dId);
        normalMap.camera  = await CameraFactory.constructFromIdAsync(dtoNormalMap.cameraId);

        return normalMap;
    }

    public width: number;
    public height: number;
    public format: NormalMapFormat;

    // Navigation Properties
    public project: Project;
    public model3d: Model3d;
    public _camera: BaseCamera;

    // Private
    private _rgbaArray: Uint8Array;

    /**
     * Creates an instance of NormalMap.
     * @param {IGeneratedFileModel} [parameters={}] GeneratedFileModel properties.
     */
    constructor(parameters: IGeneratedFileModel = {}) {

        parameters.name        = parameters.name        || "NormalMap";
        parameters.description = parameters.description || "NormalMAp";

        super(parameters);

        this.initialize();
    }

//#region Properties
    /**
     * @description Returns the raw RGBA values of the normal map.
     * @type {Float32Array}
     */
    get rgbaArray(): Uint8Array {

        return this._rgbaArray;
    }
    /**
     * @description Sets the raw RGBA values of the normal map.
     */
    set rgbaArray(value: Uint8Array) {

        this._rgbaArray = value;
    }

    /**
     * @description Returns the associated camera.
     * @readonly
     * @type {Camera}
     */
    get camera(): BaseCamera {

        return this._camera;
    }

    /**
     * @description Sets the associated camera.
     */
    set camera(value: BaseCamera) {

        this._camera = value;
    }

    /**
     * @description Returns the aspect ratio of the normal map.
     * @readonly
     * @type {number}
     */
    get aspectRatio(): number {

        return this.width / this.height;
    }
//#endregion

    /**
     * @description Perform setup and initialization.
     */
    public initialize(): void {
    }

    /**
     * @description Returns a DTO NormalMap from the instance.
     * @returns {Dto.NormalMap}
     */
    public toDtoModel(): Dto.NormalMap {

        const model = new Dto.NormalMap({
            id              : this.id,
            name            : this.name,
            description     : this.description,

            width           : this.width,
            height          : this.height,
            format          : this.format,

            projectId       : this.project ? this.project.id : undefined,
            model3dId       : this.model3d ? this.model3d.id : undefined,
            cameraId        : this.camera  ? this.camera.id : undefined,

            fileTimeStamp      : this.fileTimeStamp,
            fileIsSynchronized : this.fileIsSynchronized,
        });

        return model;
    }

    /**
     * @description Analyzes properties of a normal map.
     */
    public analyze() {
        // this._logger.clearLog();

        const middle = this.width / 2;
        const decimalPlaces = 5;
        const headerStyle   = "font-family : monospace; font-weight : bold; color : yellow; font-size : 18px";
        const messageStyle  = "font-family : monospace; color : white; font-size : 14px";

        this._logger.addEmptyLine();
    }
}
