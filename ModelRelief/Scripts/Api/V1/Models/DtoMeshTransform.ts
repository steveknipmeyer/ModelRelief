// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";

import {DtoModel} from "Scripts/Api/V1/Base/DtoModel";
import {IMeshTransform} from "Scripts/Api/V1/Interfaces/IMeshTransform";
import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {IProject} from "Scripts/Api/V1/Interfaces/IProject";
import {HttpLibrary, ServerEndPoints} from "Scripts/System/Http";
/**
 *  Concrete implementation of IMeshTransform.
 *  @class
 */
export class DtoMeshTransform extends DtoModel<DtoMeshTransform> implements IMeshTransform {

    public width: number;
    public height: number;
    public depth: number;

    // Gradient Threshold
    gradientThresholdEnabled?: boolean
    gradientThreshold?: number;

    // Gradient Attenuation
    attenuationEnabled?: boolean;
    attenuationFactor?: number;               // attenuation (~a)
    attenuationDecay?: number;                // attenuation decay (b)

    // Unsharp Masking
    unsharpMaskingEnabled?: boolean;
    unsharpGaussianLow?: number;              // Gaussian low
    unsharpGaussianHigh?: number;             // Gaussian high
    unsharpHighFrequencyScale?: number;       // high frequency scaling

    // Geometry
    planarBackground?: boolean;               // force background to zero
    translateMeshZPositive?: boolean;         // force all mesh points to Z+

    // Silhouette Processing
    silhouetteEnabled?: boolean;
    silhouetteEdgeWidth?: number;             // edge width of contours
    silhouetteSigma?: boolean;                // Gaussian blur

    // Final Scale
    reliefScale?: number;                     // relief scale (% of original model)

    // P1 (placeholder)
    p1Enabled?: boolean;
    p1?: number;
    // P2 (placeholder)
    p2Enabled?: boolean;
    p2?: number;
    // P3 (placeholder)
    p3Enabled?: boolean;
    p3?: number;
    // P4 (placeholder)
    p4Enabled?: boolean;
    p4?: number;
    // P5 (placeholder)
    p5Enabled?: boolean;
    p5?: number;
    // P6 (placeholder)
    p6Enabled?: boolean;
    p6?: number;
    // P7 (placeholder)
    p7Enabled?: boolean;
    p7?: number;
    // P8 (placeholder)
    p8Enabled?: boolean;
    p8?: number;


    // Navigation Properties
    public projectId: number;
    public project: IProject;

    /**
     * Creates an instance of a MeshTransform.
     * @param {IMeshTransform} parameters
     */
    constructor(parameters: IMeshTransform = {}) {

        super(parameters);

        this.endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiMeshTransforms}`;

        const {
            width,
            height,
            depth,

            gradientThresholdEnabled,
            gradientThreshold,

            attenuationEnabled,
            attenuationFactor,
            attenuationDecay,

            unsharpMaskingEnabled,
            unsharpGaussianLow,
            unsharpGaussianHigh,
            unsharpHighFrequencyScale,

            planarBackground,
            translateMeshZPositive,

            silhouetteEnabled,
            silhouetteEdgeWidth,
            silhouetteSigma,

            reliefScale,

            p1Enabled,
            p1,
            p2Enabled,
            p2,
            p3Enabled,
            p3,
            p4Enabled,
            p4,
            p5Enabled,
            p5,
            p6Enabled,
            p6,
            p7Enabled,
            p7,
            p8Enabled,
            p8,

            // Navigation Properties
            projectId,
            project,
        } = parameters;

        this.width = width;
        this.height = height;
        this.depth = depth;

        this.gradientThresholdEnabled = gradientThresholdEnabled;
        this.gradientThreshold = gradientThreshold;

        this.attenuationEnabled = attenuationEnabled;
        this.attenuationFactor = attenuationFactor;
        this.attenuationDecay = attenuationDecay;

        this.unsharpMaskingEnabled = unsharpMaskingEnabled;
        this.unsharpGaussianLow = unsharpGaussianLow;
        this.unsharpGaussianHigh = unsharpGaussianHigh;
        this.unsharpHighFrequencyScale = unsharpHighFrequencyScale;

        this.planarBackground = planarBackground;
        this.translateMeshZPositive = translateMeshZPositive;

        this.silhouetteEnabled = silhouetteEnabled;
        this.silhouetteEdgeWidth = silhouetteEdgeWidth;
        this.silhouetteSigma = silhouetteSigma;

        this.reliefScale = reliefScale;

        this.p1Enabled = p1Enabled;
        this.p1 = p1;
        this.p2Enabled = p2Enabled;
        this.p2 = p2;
        this.p3Enabled = p3Enabled;
        this.p3 = p3;
        this.p4Enabled = p4Enabled;
        this.p4 = p4;
        this.p5Enabled = p5Enabled;
        this.p5 = p5;
        this.p6Enabled = p6Enabled;
        this.p6 = p6;
        this.p7Enabled = p7Enabled;
        this.p7 = p7;
        this.p8Enabled = p8Enabled;
        this.p8 = p8;

        // Navigation Properties
        this.projectId = projectId;
        this.project = project;
    }

    /**
     * @description Constructs an instance of a MeshTransform.
     * @param {IModel} parameters : DtoMeshTransform
     * @returns {DtoMeshTransform}
     */
    public factory(parameters: IModel): DtoMeshTransform {
        return new DtoMeshTransform(parameters);
    }
}
