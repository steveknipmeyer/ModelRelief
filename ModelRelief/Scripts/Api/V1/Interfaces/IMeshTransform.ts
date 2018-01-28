// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { IProject }         from 'IProject'
import { IModel }           from 'IModel'

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

    depth?: number;
    width?: number;

    tau?: number;                        // attenutation
    sigmaGaussianBlur?: number;          // Gaussian blur
    sigmaGaussianSmooth?: number;        // Gaussian smoothing
    lambdaLinearScaling?: number;        // scaling
           
    // Navigation Properties
    projectId?: number;
    project?: IProject;
}


