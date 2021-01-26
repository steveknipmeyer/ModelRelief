// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto from "Scripts/Api/V1//Models/DtoModels";

import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {Model} from "Scripts/Api/V1/Models/Model";
import {Project} from "Scripts/Models/Project/Project";

/**
 * @description Represents a mesh transform.
 * @export
 * @class MeshTransform
 * @extends {Model}
 */
export class MeshTransform extends Model {

    /**
     * @description Returns a MeshTransform instance through an HTTP query of the Id.
     * @static
     * @param {number} id MeshTransform Id.
     * @returns {Promise<MeshTransform>}
     */
    public static async fromIdAsync(id: number ): Promise<MeshTransform> {

        if (!id)
            return undefined;

        const meshTransform = new Dto.MeshTransform ({
            id,
        });
        const meshTransformModel = await meshTransform.getAsync();
        return MeshTransform.fromDtoModelAsync(meshTransformModel);
    }

    /**
     * @description Constructs an instance from a DTO model.
     * @returns {MeshTransform}
     */
    public static async fromDtoModelAsync(dtoMeshTransform: Dto.MeshTransform): Promise<MeshTransform> {

        // constructor
        const meshTransform = new MeshTransform ({
            id          : dtoMeshTransform.id,
            name        : dtoMeshTransform.name,
            description : dtoMeshTransform.description,
        });

        meshTransform.width       = dtoMeshTransform.width;
        meshTransform.height      = dtoMeshTransform.height;
        meshTransform.depth       = dtoMeshTransform.depth;

        meshTransform.gradientThreshold         = dtoMeshTransform.gradientThreshold;
        meshTransform.attenuationFactor         = dtoMeshTransform.attenuationFactor;
        meshTransform.attenuationDecay          = dtoMeshTransform.attenuationDecay;
        meshTransform.unsharpGaussianLow        = dtoMeshTransform.unsharpGaussianLow;
        meshTransform.unsharpGaussianHigh       = dtoMeshTransform.unsharpGaussianHigh;
        meshTransform.unsharpHighFrequencyScale = dtoMeshTransform.unsharpHighFrequencyScale;
        meshTransform.reliefScale               = dtoMeshTransform.reliefScale;

        meshTransform.p1                        = dtoMeshTransform.p1;
        meshTransform.p2                        = dtoMeshTransform.p2;
        meshTransform.p3                        = dtoMeshTransform.p3;
        meshTransform.p4                        = dtoMeshTransform.p4;
        meshTransform.p5                        = dtoMeshTransform.p5;
        meshTransform.p6                        = dtoMeshTransform.p6;
        meshTransform.p7                        = dtoMeshTransform.p7;
        meshTransform.p8                        = dtoMeshTransform.p8;

        meshTransform.project = await Project.fromIdAsync(dtoMeshTransform.projectId);

        return meshTransform;
    }

    public width: number;
    public height: number;
    public depth: number;

    public gradientThreshold: number;
    public attenuationFactor: number;
    public attenuationDecay: number;
    public unsharpGaussianLow: number;
    public unsharpGaussianHigh: number;
    public unsharpHighFrequencyScale: number;
    public reliefScale: number;
    public p1: number;
    public p2: number;
    public p3: number;
    public p4: number;
    public p5: number;
    public p6: number;
    public p7: number;
    public p8: number;

    // Navigation Properties
    public project: Project;

    /**
     * @constructor
     * Creates an instance of MeshTransform.
     * @param {IModel} [parameters={}] IModel properties.
     */
    constructor(parameters: IModel = {}) {

        parameters.name        = parameters.name        || "MeshTransform";
        parameters.description = parameters.description || "MeshTransform";

        super(parameters);

        this.initialize();
    }

    /**
     * @description Perform setup and initialization.
     */
    public initialize(): void {
        // NOP
    }

    /**
     * @description Returns a DTO MeshTransform from the instance.
     * @returns {Dto.MeshTransform}
     */
    public toDtoModel(): Dto.MeshTransform {

        const meshTransform = new Dto.MeshTransform({
            id              : this.id,
            name            : this.name,
            description     : this.description,

            width       : this.width,
            height      : this.height,
            depth       : this.depth,

            gradientThreshold          : this.gradientThreshold,
            attenuationFactor          : this.attenuationFactor,
            attenuationDecay           : this.attenuationDecay,
            unsharpGaussianLow         : this.unsharpGaussianLow,
            unsharpGaussianHigh        : this.unsharpGaussianHigh,
            unsharpHighFrequencyScale  : this.unsharpHighFrequencyScale,
            reliefScale                : this.reliefScale,
            p1                         : this.p1,
            p2                         : this.p2,
            p3                         : this.p3,
            p4                         : this.p4,
            p5                         : this.p5,
            p6                         : this.p6,
            p7                         : this.p7,
            p8                         : this.p8,

            projectId           : this.project ? this.project.id : undefined,
        });

        return meshTransform;
    }
}
