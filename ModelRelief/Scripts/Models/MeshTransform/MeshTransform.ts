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

        meshTransform.gradientThresholdEnabled  = dtoMeshTransform.gradientThresholdEnabled;
        meshTransform.gradientThreshold         = dtoMeshTransform.gradientThreshold;

        meshTransform.attenuationEnabled        = dtoMeshTransform.attenuationEnabled;
        meshTransform.attenuationFactor         = dtoMeshTransform.attenuationFactor;
        meshTransform.attenuationDecay          = dtoMeshTransform.attenuationDecay;

        meshTransform.unsharpMaskingEnabled     = dtoMeshTransform.unsharpMaskingEnabled;
        meshTransform.unsharpGaussianLow        = dtoMeshTransform.unsharpGaussianLow;
        meshTransform.unsharpGaussianHigh       = dtoMeshTransform.unsharpGaussianHigh;
        meshTransform.unsharpHighFrequencyScale = dtoMeshTransform.unsharpHighFrequencyScale;

        meshTransform.planarBackground = dtoMeshTransform.planarBackground;
        meshTransform.translateMeshZPositive = dtoMeshTransform.translateMeshZPositive;

        meshTransform.silhouetteEnabled         = dtoMeshTransform.silhouetteEnabled;
        meshTransform.silhouetteEdgeWidth       = dtoMeshTransform.silhouetteEdgeWidth;
        meshTransform.silhouetteSigma           = dtoMeshTransform.silhouetteSigma;

        meshTransform.reliefScale               = dtoMeshTransform.reliefScale;

        meshTransform.p1Enabled                 = dtoMeshTransform.p1Enabled;
        meshTransform.p1                        = dtoMeshTransform.p1;
        meshTransform.p2Enabled                 = dtoMeshTransform.p2Enabled;
        meshTransform.p2                        = dtoMeshTransform.p2;
        meshTransform.p3Enabled                 = dtoMeshTransform.p3Enabled;
        meshTransform.p3                        = dtoMeshTransform.p3;
        meshTransform.p4Enabled                 = dtoMeshTransform.p4Enabled;
        meshTransform.p4                        = dtoMeshTransform.p4;
        meshTransform.p5Enabled                 = dtoMeshTransform.p5Enabled;
        meshTransform.p5                        = dtoMeshTransform.p5;
        meshTransform.p6Enabled                 = dtoMeshTransform.p6Enabled;
        meshTransform.p6                        = dtoMeshTransform.p6;
        meshTransform.p7Enabled                 = dtoMeshTransform.p7Enabled;
        meshTransform.p7                        = dtoMeshTransform.p7;
        meshTransform.p8Enabled                 = dtoMeshTransform.p8Enabled;
        meshTransform.p8                        = dtoMeshTransform.p8;

        meshTransform.project = await Project.fromIdAsync(dtoMeshTransform.projectId);

        return meshTransform;
    }

    public width: number;
    public height: number;
    public depth: number;

    // Gradient Threshold
    public gradientThresholdEnabled: boolean
    public gradientThreshold: number;

    // Gradient Attenuation
    public attenuationEnabled: boolean;
    public attenuationFactor: number;               // attenuation (~a)
    public attenuationDecay: number;                // attenuation decay (b)

    // Unsharp Masking
    public unsharpMaskingEnabled: boolean;
    public unsharpGaussianLow: number;              // Gaussian low
    public unsharpGaussianHigh: number;             // Gaussian high
    public unsharpHighFrequencyScale: number;       // high frequency scaling

    // Geometry
    public planarBackground: boolean;               // force background to zero
    public translateMeshZPositive: boolean;         // force all mesh points to Z+

    // Silhouette Processing
    public silhouetteEnabled: boolean;
    public silhouetteEdgeWidth: number;             // edge width of contours
    public silhouetteSigma: boolean;                // Gaussian blur

    // Final Scale
    public reliefScale: number;                     // relief scale (% of original model)

    // P1 (placeholder)
    public p1Enabled: boolean;
    public p1: number;
    // P2 (placeholder)
    public p2Enabled: boolean;
    public p2: number;
    // P3 (placeholder)
    public p3Enabled: boolean;
    public p3: number;
    // P4 (placeholder)
    public p4Enabled: boolean;
    public p4: number;
    // P5 (placeholder)
    public p5Enabled: boolean;
    public p5: number;
    // P6 (placeholder)
    public p6Enabled: boolean;
    public p6: number;
    // P7 (placeholder)
    public p7Enabled: boolean;
    public p7: number;
    // P8 (placeholder)
    public p8Enabled: boolean;
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

            gradientThresholdEnabled    : this.gradientThresholdEnabled,
            gradientThreshold           : this.gradientThreshold,

            attenuationEnabled          : this.attenuationEnabled,
            attenuationFactor           : this.attenuationFactor,
            attenuationDecay            : this.attenuationDecay,

            unsharpMaskingEnabled       : this.unsharpMaskingEnabled,
            unsharpGaussianLow          : this.unsharpGaussianLow,
            unsharpGaussianHigh         : this.unsharpGaussianHigh,
            unsharpHighFrequencyScale   : this.unsharpHighFrequencyScale,

            planarBackground: this.planarBackground,
            translateMeshZPositive: this.translateMeshZPositive,

            silhouetteEnabled           : this.silhouetteEnabled,
            silhouetteEdgeWidth         : this.silhouetteEdgeWidth,
            silhouetteSigma             : this.silhouetteSigma,

            reliefScale                 : this.reliefScale,

            p1Enabled                   : this.p1Enabled,
            p1                          : this.p1,
            p2Enabled                   : this.p2Enabled,
            p2                          : this.p2,
            p3Enabled                   : this.p3Enabled,
            p3                          : this.p3,
            p4Enabled                   : this.p4Enabled,
            p4                          : this.p4,
            p5Enabled                   : this.p5Enabled,
            p5                          : this.p5,
            p6Enabled                   : this.p6Enabled,
            p6                          : this.p6,
            p7Enabled                   : this.p7Enabled,
            p7                          : this.p7,
            p8Enabled                   : this.p8Enabled,
            p8                          : this.p8,

            projectId           : this.project ? this.project.id : undefined,
        });

        return meshTransform;
    }
}
