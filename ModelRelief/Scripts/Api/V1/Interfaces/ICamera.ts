// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { IProject }    from 'IProject'
import { IModel } from 'IModel'

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
 *  N.B. All properties in the interface are optional so that an initialization object can be used to construct the concrete class.
 *  @interface
 */
export interface ICamera extends IModel {

    id?: number;
    name?: string;   
    description?: string;

    standardView?: StandardView; 
    fieldOfView?: number;

    near?: number;
    far?: number;

    boundClippingPlanes?: boolean;

    position?: THREE.Vector3;
    positionX?: number;
    positionY?: number;
    positionZ?: number;

    lookAt?: THREE.Vector3;
    lookAtX?: number;
    lookAtY?: number;
    lookAtZ?: number;
           
    // Navigation Properties
    projectId?: number;
    project?: IProject;
}


