// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { IProject }         from 'IProject'
import { ITGetModel }       from 'ITGetModel'

 /**
 *  Represents a DTO for a MeshTransform.
 *  @interface
 */
export interface IMeshTransform extends ITGetModel {

    Id: number;

    Name: string;
    Description: string;

    Depth: number;
    Width: number;

    Tau: number;
    SigmaGaussianBlur: number;
    SigmaGaussianSmooth: number;
    LambdaLinearScaling: number;
           
    // Navigation Properties
    ProjectId: number;
    Project: IProject;
}


