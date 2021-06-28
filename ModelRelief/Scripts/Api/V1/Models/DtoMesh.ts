// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";

import {DtoGeneratedFileModel} from "Scripts/Api/V1/Base/DtoGeneratedFileModel";
import {ICamera} from "Scripts/Api/V1/Interfaces/ICamera";
import {IDepthBuffer} from "Scripts/Api/V1/Interfaces/IDepthBuffer";
import {IMesh, MeshFormat} from "Scripts/Api/V1/Interfaces/IMesh";
import {IMeshTransform} from "Scripts/Api/V1/Interfaces/IMeshTransform";
import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {INormalMap} from "Scripts/Api/V1/Interfaces/INormalMap";
import {IProject} from "Scripts/Api/V1/Interfaces/IProject";
import {HttpLibrary, ServerEndPoints} from "Scripts/System/Http";

/**
 *  Concrete implementation of IMesh.
 *  @class
 */
export class DtoMesh extends DtoGeneratedFileModel<DtoMesh> implements IMesh {

    public format: MeshFormat;

    // Navigation Properties
    public projectId: number;
    public project: IProject;

    public cameraId: number;
    public camera: ICamera;

    public depthBufferId: number;
    public depthBuffer: IDepthBuffer;

    public normalMapId: number;
    public normalMap: INormalMap;

    public meshTransformId: number;
    public meshTransform: IMeshTransform;

    /**
     * Creates an instance of a Mesh.
     * @param {DtoMesh} parameters
     */
    constructor(parameters: IMesh = {}) {

        super(parameters);

        this.endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiMeshes}`;

        const {
            format,

            // Navigation Properties
            projectId,
            project,

            cameraId,
            camera,

            depthBufferId,
            depthBuffer,

            normalMapId,
            normalMap,

            meshTransformId,
            meshTransform,
        } = parameters;

        this.format = format;

        // Navigation Properties
        this.projectId = projectId;
        this.project = project;

        this.cameraId = cameraId;
        this.camera = camera;

        this.depthBufferId = depthBufferId;
        this.depthBuffer = depthBuffer;

        this.normalMapId = normalMapId;
        this.normalMap = normalMap;

        this.meshTransformId = meshTransformId;
        this.meshTransform = meshTransform;
    }

    /**
     * @description Constructs an instance of a Mesh.
     * @param {IModel} parameters : DtoMesh
     * @returns {DtoMesh}
     */
    public factory(parameters: IModel): DtoMesh {
        return new DtoMesh(parameters);
    }
}
