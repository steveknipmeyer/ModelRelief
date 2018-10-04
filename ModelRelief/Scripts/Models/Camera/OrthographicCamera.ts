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
 * @description OrthographicCamera
 * @export
 * @class OrthographicCamera
 * @extends {Model}
 */
export class OrthographicCamera extends BaseCamera {

    static FrustrumPlaneOffset : number = 100;
    static DefaulLeftPlane : number     = -OrthographicCamera.FrustrumPlaneOffset;
    static DefaulRightPlane : number    = +OrthographicCamera.FrustrumPlaneOffset;
    static DefaulTopPlane : number      = +OrthographicCamera.FrustrumPlaneOffset;
    static DefaulBottomPlane : number   = -OrthographicCamera.FrustrumPlaneOffset;

    viewCamera : THREE.OrthographicCamera;

    /**
     * @constructor
     * Creates an instance of OrthographicCamera.
     * @param {IModel} parameters IModel properties.
     * @param {THREE.OrthographicCamera} camera OrthographicCamera.
     */
    constructor(parameters: IModel, camera : THREE.OrthographicCamera) {

        super(parameters, camera);
    }

//#region Clipping Planes

    /**
     * Returns the extents of the near camera plane.
     * @returns {THREE.Vector2}
     */
    getNearPlaneExtents() : THREE.Vector2 {

        let nearWidth  = this.viewCamera.right - this.viewCamera.left;
        let nearHeight = this.viewCamera.top - this.viewCamera.bottom;

        return new THREE.Vector2(nearWidth, nearHeight);
    }
//#endregion
}
