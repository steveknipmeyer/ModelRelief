// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";

import {DtoGeneratedFileModel} from "Scripts/Api/V1/Base/DtoGeneratedFileModel";
import {ICamera} from "Scripts/Api/V1/Interfaces/ICamera";
import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {IModel3d} from "Scripts/Api/V1/Interfaces/IModel3d";
import {INormalMap, NormalMapFormat} from "Scripts/Api/V1/Interfaces/INormalMap";
import {IProject} from "Scripts/Api/V1/Interfaces/IProject";
import {HttpLibrary, ServerEndPoints} from "Scripts/System/Http";

/**
 *  Concrete implementation of INormalMap.
 *  @class
 */
export class DtoNormalMap extends DtoGeneratedFileModel<DtoNormalMap> implements INormalMap {

    public width: number;
    public height: number;
    public format: NormalMapFormat;

    // Navigation Properties
    public projectId: number;
    public project: IProject;

    public model3dId: number;
    public model3d: IModel3d;

    public cameraId: number;
    public camera: ICamera;

    /**
     * Creates an instance of NormalMap.
     * @param {INormalMap} parameters
     */
    constructor(parameters: INormalMap = {}) {

        super(parameters);

        this.endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiNormalMaps}`;

        const {
            width,
            height,
            format,

            // Navigation Properties
            projectId,
            project,

            model3dId,
            model3d,

            cameraId,
            camera,
        } = parameters;

        this.width = width;
        this.height = height;
        this.format = format;

        // Navigation Properties
        this.projectId = projectId;
        this.project = project;

        this.model3dId = model3dId;
        this.model3d = model3d;

        this.cameraId = cameraId;
        this.camera = camera;
    }

    /**
     * @description Constructs an instance of a NormalMap
     * @param {IModel} parameters : DtoNormalMap
     * @returns {DtoNormalMap}
     */
    public factory(parameters: IModel): DtoNormalMap {
        return new DtoNormalMap(parameters);
    }
}
