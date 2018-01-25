﻿// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { IProject }         from 'IProject'
import { ITGetModel }       from 'ITGetModel'

 /**
 *  Represents a DTO for a MeshTransform.
 *  @description Settings that transform a DepthBuffer to a Mesh.
 *  @interface
 */
export interface IMeshTransform extends ITGetModel {

    id: number;

    name: string;
    description: string;

    depth: number;
    width: number;

    tau: number;                        // attenutation
    sigmaGaussianBlur: number;          // Gaussian blur
    sigmaGaussianSmooth: number;        // Gaussian smoothing
    lambdaLinearScaling: number;        // scaling
           
    // Navigation Properties
    projectId: number;
    project: IProject;
}


