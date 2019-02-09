
// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {IProject} from "Scripts/Api/V1/Interfaces/IProject";

 /**
  *  Represents a DTO for a MeshTransform.
  *  N.B. All properties in the interface are optional so that an initialization object can be used to construct the concrete class.
  *  @description Settings that transform a DepthBuffer to a Mesh.
  *  @interface
  */
export interface IMeshTransform extends IModel {

    id?: number;
    name?: string;
    description?: string;

    width?: number;
    height?: number;
    depth?: number;

    gradientThreshold?: number;             // gradient threshold
    attenuationFactor?: number;             // gradient attenuation (~a)
    attenuationDecay?: number;              // gradient attenuation decay (b)
    unsharpGaussianLow?: number;            // unsharp masking Gaussian low
    unsharpGaussianHigh?: number;           // unsharp masking Gaussian high
    unsharpHighFrequencyScale?: number;     // Unsharp masking high frequency scaling
    p1?: number;                            // placeholder
    p2?: number;                            // placeholder
    p3?: number;                            // placeholder
    p4?: number;                            // placeholder
    p5?: number;                            // placeholder
    p6?: number;                            // placeholder
    p7?: number;                            // placeholder
    p8?: number;                            // placeholder

    // Navigation Properties
    projectId?: number;
    project?: IProject;
}


