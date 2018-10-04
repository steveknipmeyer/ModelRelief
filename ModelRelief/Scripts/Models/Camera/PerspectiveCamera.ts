// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto          from 'DtoModels'
import * as THREE        from 'three'

import { BaseCamera }                   from 'BaseCamera'
import { ICamera, StandardView }        from 'ICamera'
import { DepthBufferFactory }           from 'DepthBufferFactory'
import { Graphics }                     from 'Graphics'
import { HttpLibrary, ServerEndPoints}  from 'Http'
import { IModel }                       from 'IModel'
import { Model }                        from 'Model'
import { Project }                      from 'Project'
import { Services }                     from 'Services'
import { StopWatch }                    from 'StopWatch'

/**
 * @description PerspectiveCamera
 * @export
 * @class PerspectiveCamera
 * @extends {Model}
 */
export class PerspectiveCamera extends BaseCamera {

    static DefaultFieldOfView  : number =   37;       // 35mm vertical : https://www.nikonians.org/reviews/fov-tables

    viewCamera : THREE.PerspectiveCamera;

    /**
     * @constructor
     * Creates an instance of PerspectiveCamera.
     * @param {IModel} parameters IModel properties.
     * @param {THREE.PerspectiveCamera} camera PerspectiveCamera.
     */
    constructor(parameters: IModel, camera : THREE.PerspectiveCamera) {

        super(parameters, camera);
    }

//#region Clipping Planes

    /**
     * Returns the extents of the near camera plane.
     * @returns {THREE.Vector2}
     */
    getNearPlaneExtents() : THREE.Vector2 {

        let cameraFOVRadians = this.viewCamera.fov * (Math.PI / 180);
        let nearHeight = 2 * Math.tan(cameraFOVRadians / 2) * this.viewCamera.near;
        let nearWidth  = this.viewCamera.aspect * nearHeight;

        return new THREE.Vector2(nearWidth, nearHeight);
    }
//#endregion
}
