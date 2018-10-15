// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto   from 'DtoModels'
import {BaseCamera}             from 'BaseCamera';
import {OrthographicCamera}     from 'BaseCamera';
import {PerspectiveCamera}      from 'BaseCamera';

/**
 * Camera
 * Camera factory: instantiate a specialized BaseCamera.
 * @class
 */
export class CameraFactory {

    /**
     * @constructor
     */
    constructor() {
    }

    /**
     * @description Construct a camera (Orthographic, Perspective) from an Id.
     * @static
     * @param {number} id Camera Id.
     * @returns {Promise<BaseCamera>}
     */
    static async Construct(id: number) : Promise<BaseCamera> {

        let dtoCamera = await Dto.Camera.fromIdAsync(id);
        let viewCamera = dtoCamera.getViewCamera();
        let cameraParameters = {id: dtoCamera.id, name: dtoCamera.name, description: dtoCamera.description};
        let camera  = dtoCamera.isPerspective ?
            new PerspectiveCamera(cameraParameters, <THREE.PerspectiveCamera> viewCamera) :
            new OrthographicCamera(cameraParameters, <THREE.OrthographicCamera> viewCamera);

        return camera;
    }
}
