// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { IModel }           from 'IModel'
import { IProject }         from 'IProject'

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
    attenuationFactor?:number;              // gradient attenuation (~a)
    attenuationDecay?:number;               // gradient attenuation decay (b)
    unsharpGaussianLow?: number;            // unsharp masking Gaussian low
    unsharpGaussianHigh?: number;           // unsharp masking Gaussian high
    unsharpHighFrequencyScale?: number;     // Unsharp masking high frequency scaling
    p1?: number;                            // placeholder
    p2?: number;                            // placeholder
           
    // Navigation Properties
    projectId?: number;
    project?: IProject;
}


