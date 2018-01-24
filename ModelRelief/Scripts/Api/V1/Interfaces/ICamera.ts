// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { IProject }    from 'IProject'
import { ITGetModel } from 'ITGetModel'

 /**
 *  Standard camera views.
 *  @enum {number}
 */
export enum StandardView {
    None,
    Front,
    Back,
    Top,
    Bottom,
    Left,
    Right,
    Isometric
}

 /**
 *  Represents a DTO for a Camera.
 *  @interface
 */
export interface ICamera extends ITGetModel {

    id: number;

    name: string;
    description: string;

    StandardView: StandardView; 
    FieldOfView: number;

    near: number;
    far: number;

    BoundClippingPlanes: boolean;

    positionX: number;
    positionY: number;
    positionZ: number;

    lookAtX: number;
    lookAtY: number;
    lookAtZ: number;
           
    // Navigation Properties
    projectId: number;
    project: IProject;
}


