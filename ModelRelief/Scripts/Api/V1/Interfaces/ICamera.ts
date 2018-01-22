// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { IProject }   from 'IProject'
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

    Id: number;

    Name: string;
    Description: string;

    StandardView: StandardView; 
    FieldOfView: number;

    Near: number;
    Far: number;

    BoundClippingPlanes: boolean;

    PositionX: number;
    PositionY: number;
    PositionZ: number;

    LookAtX: number;
    LookAtY: number;
    LookAtZ: number;
           
    // Navigation Properties
    ProjectId: number;
    Project: IProject;
}


