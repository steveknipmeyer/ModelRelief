// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {DtoGeneratedFileModel} from "Scripts/Api/V1/Base/DtoGeneratedFileModel";
import {ICamera} from "Scripts/Api/V1/Interfaces/ICamera";
import {DepthBufferFormat, IDepthBuffer} from "Scripts/Api/V1/Interfaces/IDepthBuffer";
import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {IModel3d} from "Scripts/Api/V1/Interfaces/IModel3d";
import {IProject} from "Scripts/Api/V1/Interfaces/IProject";
import {HttpLibrary, ServerEndPoints} from "Scripts/System/Http";
/**
 *  Concrete implementation of IDepthBuffer.
 *  @class
 */
export class DtoDepthBuffer extends DtoGeneratedFileModel<DtoDepthBuffer> implements IDepthBuffer {

    public width: number;
    public height: number;
    public format: DepthBufferFormat;

    // Navigation Properties
    public projectId: number;
    public project: IProject;

    public model3dId: number;
    public model3d: IModel3d;

    public cameraId: number;
    public camera: ICamera;

    /**
     * Creates an instance of DepthBuffer.
     * @param {IDepthBuffer} parameters
     */
    constructor(parameters: IDepthBuffer = {}) {

        super(parameters);

        this.endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiDepthBuffers}`;

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
     * @description Constructs an instance of a DepthBuffer
     * @param {IModel} parameters : DtoDepthBuffer
     * @returns {DtoDepthBuffer}
     */
    public factory(parameters: IModel): DtoDepthBuffer {
        return new DtoDepthBuffer(parameters);
    }
}

