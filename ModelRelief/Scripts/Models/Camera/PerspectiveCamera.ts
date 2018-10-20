// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE from "three";

import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {BaseCamera} from "Scripts/Models/Camera/BaseCamera";

/**
 * @description PerspectiveCamera
 * @export
 * @class PerspectiveCamera
 * @extends {Model}
 */
export class PerspectiveCamera extends BaseCamera {

    public viewCamera: THREE.PerspectiveCamera;

    /**
     * @constructor
     * Creates an instance of PerspectiveCamera.
     * @param {IModel} parameters IModel properties.
     * @param {THREE.PerspectiveCamera} camera PerspectiveCamera.
     */
    constructor(parameters: IModel, camera: THREE.PerspectiveCamera) {

        super(parameters, camera);
    }

//#region Clipping Planes

    /**
     * Returns the extents of the near camera plane.
     * @returns {THREE.Vector2}
     */
    public getNearPlaneExtents(): THREE.Vector2 {

        const cameraFOVRadians = this.viewCamera.fov * (Math.PI / 180);
        const nearHeight = 2 * Math.tan(cameraFOVRadians / 2) * this.viewCamera.near;
        const nearWidth  = this.viewCamera.aspect * nearHeight;

        return new THREE.Vector2(nearWidth, nearHeight);
    }
//#endregion
}
