// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";

import {DtoFileModel} from "Scripts/Api/V1/Base/DtoFileModel";
import {ICamera} from "Scripts/Api/V1/Interfaces/ICamera";
import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {IModel3d, Model3dFormat} from "Scripts/Api/V1/Interfaces/IModel3d";
import {IProject} from "Scripts/Api/V1/Interfaces/IProject";
import {HttpLibrary, ServerEndPoints} from "Scripts/System/Http";

/**
 *  Concrete implementation of IModel3d.
 *  @class
 */
export class DtoModel3d extends DtoFileModel<DtoModel3d> implements IModel3d {

    public format: Model3dFormat;

    // Navigation Properties
    public projectId: number;
    public project: IProject;

    public cameraId: number;
    public camera: ICamera;

    /**
     * Creates an instance of a Model3d.
     * @param {IModel3d} parameters
     */
    constructor(parameters: IModel3d = {}) {

        super(parameters);

        this.endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiModels}`;

        const {
            format,

            // Navigation Properties
            projectId,
            project,

            cameraId,
            camera,
        } = parameters;

        this.format = format;

        // Navigation Properties
        this.projectId = projectId;
        this.project = project;

        this.cameraId = cameraId;
        this.camera = camera;
    }

    /**
     * @description Constructs an instance of a Model3d.
     * @param {IModel} parameters : DtoModel3d
     * @returns {DtoModel3d}
     */
    public factory(parameters: IModel): DtoModel3d {
        return new DtoModel3d(parameters);
    }
}
