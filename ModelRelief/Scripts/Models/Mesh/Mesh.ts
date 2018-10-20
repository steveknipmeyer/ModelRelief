// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto from "Scripts/Api/V1//Models/DtoModels";
import * as THREE from "three";

import {IGeneratedFileModel} from "Scripts/Api/V1/Interfaces/IGeneratedFileModel";
import {MeshFormat} from "Scripts/Api/V1/Interfaces/IMesh";
import {GeneratedFileModel} from "Scripts/Api/V1/Models/GeneratedFileModel";
import {BaseCamera} from "Scripts/Models/Camera/Camera";
import {CameraFactory} from "Scripts/Models/Camera/CameraFactory";
import {DepthBuffer} from "Scripts/Models/DepthBuffer/DepthBuffer";
import {MeshTransform} from "Scripts/Models/MeshTransform/MeshTransform";
import {Project} from "Scripts/Models/Project/Project";

/**
 * @description Represents a mesh.
 * @export
 * @class Mesh
 * @extends {GeneratedFileModel}
 */
export class Mesh extends GeneratedFileModel {

    //#region Properties
    /**
     * @description Returns the width.
     * @readonly
     * @type {number}
     */
    get width(): number {
        return this.depthBuffer.width;
    }

    /**
     * @description Returns the height.
     * @readonly
     * @type {number}
     */
    get height(): number {
        return this.depthBuffer.height;
    }

    /**
     * @description Returns a Mesh instance through an HTTP query of the Id.
     * @static
     * @param {number} id Mesh Id.
     * @returns {Promise<Mesh>}
     */
    public static async fromIdAsync(id: number ): Promise<Mesh> {

        if (!id)
            return undefined;

        const mesh = new Dto.Mesh ({
            id,
        });
        const meshModel = await mesh.getAsync();
        return Mesh.fromDtoModelAsync(meshModel);
    }

    /**
     * @description Constructs an instance from a DTO model.
     * @returns {Mesh}
     */
    public static async fromDtoModelAsync(dtoMesh: Dto.Mesh): Promise<Mesh> {

        // constructor
        const mesh = new Mesh ({
            id          : dtoMesh.id,
            name        : dtoMesh.name,
            description : dtoMesh.description,
            },
        );

        mesh.fileTimeStamp      = dtoMesh.fileTimeStamp;
        mesh.fileIsSynchronized = dtoMesh.fileIsSynchronized;
        mesh.format             = dtoMesh.format;

        mesh.project = await Project.fromIdAsync(dtoMesh.projectId);
        mesh.camera  = await CameraFactory.ConstructFromIdAsync(dtoMesh.cameraId);
        mesh.depthBuffer    = await DepthBuffer.fromIdAsync(dtoMesh.depthBufferId);
        mesh.meshTransform  = await MeshTransform.fromIdAsync(dtoMesh.meshTransformId);

        return mesh;
    }

    public format: MeshFormat;

    // Navigation Properties
    public project: Project;
    public camera: BaseCamera;
    public depthBuffer: DepthBuffer;
    public meshTransform: MeshTransform;

    /**
     * Creates an instance of Mesh.
     * @param {IGeneratedFileModel} [parameters={}] GeneratedFileModel properties.
     */
    constructor(parameters: IGeneratedFileModel) {

        parameters.name        = parameters.name        || "Mesh";
        parameters.description = parameters.description || "Mesh";

        super(parameters);

        this.initialize();
    }

    /**
     * @description Perform setup and initialization.
     */
    public initialize(): void {
    }

    /**
     * @description Returns a DTO Mesh from the instance.
     * @returns {Dto.Mesh}
     */
    public toDtoModel(): Dto.Mesh {

        const mesh = new Dto.Mesh({
            id              : this.id,
            name            : this.name,
            description     : this.description,

            format          : this.format,

            projectId       : this.project ? this.project.id : undefined,
            cameraId        : this.camera ? this.camera.id : undefined,
            depthBufferId   : this.depthBuffer ? this.depthBuffer.id : undefined,
            meshTransformId : this.meshTransform ? this.meshTransform.id : undefined,

            fileTimeStamp      : this.fileTimeStamp,
            fileIsSynchronized : this.fileIsSynchronized,
        });

        return mesh;
    }
    //#endregion
}
