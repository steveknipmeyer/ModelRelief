// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE from "three";

import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {IProject} from "Scripts/Api/V1/Interfaces/IProject";

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
    Isometric,
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
    isPerspective?: boolean;

    near?: number;
    far?: number;

    // vector or explicit coordinates
    position?: THREE.Vector3;
    positionX?: number;
    positionY?: number;
    positionZ?: number;

    // vector or explicit coordinates
    quaternion?: THREE.Quaternion;
    eulerX?: number;
    eulerY?: number;
    eulerZ?: number;
    theta?: number;

    // vector or explicit coordinates
    scale?: THREE.Vector3;
    scaleX?: number;
    scaleY?: number;
    scaleZ?: number;

    // vector or explicit coordinates
    up?: THREE.Vector3;
    upX?: number;
    upY?: number;
    upZ?: number;

    // Perspective
    fieldOfView?: number;
    aspectRatio?: number;

    // Orthographic
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;

    // Navigation Properties
    projectId?: number;
    project?: IProject;
}
