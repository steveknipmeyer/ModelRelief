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
 * @description OrthographicCamera
 * @export
 * @class OrthographicCamera
 * @extends {Model}
 */
export class OrthographicCamera extends BaseCamera {

    public viewCamera: THREE.OrthographicCamera;

    /**
     * @constructor
     * Creates an instance of OrthographicCamera.
     * @param {IModel} parameters IModel properties.
     * @param {THREE.OrthographicCamera} camera OrthographicCamera.
     */
    constructor(parameters: IModel, camera: THREE.OrthographicCamera) {

        super(parameters, camera);
    }

//#region Clipping Planes

    /**
     * Returns the extents of the near camera plane.
     * @returns {THREE.Vector2}
     */
    public getNearPlaneExtents(): THREE.Vector2 {

        const nearWidth  = this.viewCamera.right - this.viewCamera.left;
        const nearHeight = this.viewCamera.top - this.viewCamera.bottom;

        return new THREE.Vector2(nearWidth, nearHeight);
    }

    /**
     * Returns the extents of the far camera plane.
     * @returns {THREE.Vector2}
     */
    public getFarPlaneExtents(): THREE.Vector2 {
        // near = far
        return this.getNearPlaneExtents();
    }

//#endregion
}
