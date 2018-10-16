// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto   from 'DtoModels'
import * as THREE from 'three'

import { BaseCamera }                   from 'Camera'
import { CameraFactory }                from "CameraFactory";
import { DepthBuffer }                  from 'DepthBuffer'
import { GeneratedFileModel }           from 'GeneratedFileModel'
import { IGeneratedFileModel }          from 'IGeneratedFileModel'
import { MeshFormat }                   from 'IMesh'
import { Loader }                       from 'Loader';
import { MeshTransform }                from 'MeshTransform'
import { Project }                      from 'Project'

/**
 * @description Represents a mesh.
 * @export
 * @class Mesh
 * @extends {GeneratedFileModel}
 */
export class Mesh extends GeneratedFileModel {

    format: MeshFormat;

    // Navigation Properties
    project         : Project;
    camera          : BaseCamera;
    depthBuffer     : DepthBuffer;
    meshTransform   : MeshTransform;

    /**
     * Creates an instance of Mesh.
     * @param {IGeneratedFileModel} [parameters={}] GeneratedFileModel properties.
     */
    constructor(parameters : IGeneratedFileModel) {

        parameters.name        = parameters.name        || "Mesh";
        parameters.description = parameters.description || "Mesh";

        super(parameters);

        this.initialize();
    }

    /**
     * @description Perform setup and initialization.
     */
    initialize(): void {
    }

    /**
     * @description Returns a Mesh instance through an HTTP query of the Id.
     * @static
     * @param {number} id Mesh Id.
     * @returns {Promise<Mesh>}
     */
    static async fromIdAsync(id : number ) : Promise<Mesh> {

        if (!id)
            return undefined;

        let mesh = new Dto.Mesh ({
            id : id
        });
        let meshModel = await mesh.getAsync();
        return Mesh.fromDtoModelAsync(meshModel);
    }

    /**
     * @description Constructs an instance from a DTO model.
     * @returns {Mesh}
     */
    static async fromDtoModelAsync(dtoMesh : Dto.Mesh) : Promise<Mesh> {

        // constructor
        let mesh = new Mesh ({
            id          : dtoMesh.id,
            name        : dtoMesh.name,
            description : dtoMesh.description,
            }
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

    /**
     * @description Returns a DTO Mesh from the instance.
     * @returns {Dto.Mesh}
     */
    toDtoModel() : Dto.Mesh {

        let mesh = new Dto.Mesh({
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
    //#endregion

    /**
     * @description Constructs a graphics mesh.
     * @returns {Promise<THREE.Group>}
     */
    async getModelGroupAsync() : Promise<THREE.Group> {

        return this.constructGraphicssAsync();
    }

    //#region Generation
    /**
     * @description Generates a mesh.
     * @returns {Promise<THREE.Group>} Group holding the mesh.
     */
    async constructGraphicssAsync(): Promise<THREE.Group> {

        let loader = new Loader();
        let modelGroup = loader.loadModelAsync(this);

        return modelGroup;
    }
    //#endregion
}
