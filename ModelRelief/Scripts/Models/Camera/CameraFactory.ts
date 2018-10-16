// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto         from 'DtoModels'
import * as THREE       from 'three'

import {BaseCamera}             from 'Camera';
import {OrthographicCamera}     from 'Camera';
import {PerspectiveCamera}      from 'Camera';
import { IModel }               from 'IModel'
import { IThreeBaseCamera }             from 'IThreeBaseCamera'
import { Project }              from 'Project'

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
    static async ConstructFromIdAsync(id: number) : Promise<BaseCamera> {

        let dtoCamera = await Dto.Camera.fromIdAsync(id);
        let camera = await CameraFactory.ConstructFromDtoModelAsync(dtoCamera);

        return camera;
    }

    /**
     * @description Construct a camera (Orthographic, Perspective) from a DTO Camera.
     * @static
     * @param {number} id Camera Id.
     * @returns {Promise<BaseCamera>}
     */
    static async ConstructFromDtoModelAsync(dtoCamera : Dto.Camera) : Promise<BaseCamera> {

        let viewCamera = dtoCamera.getViewCamera();
        let cameraParameters = {id: dtoCamera.id, name: dtoCamera.name, description: dtoCamera.description};
        let camera  = dtoCamera.isPerspective ?
            new PerspectiveCamera(cameraParameters, <THREE.PerspectiveCamera> viewCamera) :
            new OrthographicCamera(cameraParameters, <THREE.OrthographicCamera> viewCamera);

        camera.project  = await Project.fromIdAsync(dtoCamera.projectId);

        return camera;
    }

    /**
     * @description Construct a camera (Orthographic, Perspective) from a graphics View camera.
     * @static
     * @param {IModel} parameters IModel properties.
     * @param {IThreeBaseCamera} camera IThreeBaseCamera.
     * @returns {Promise<BaseCamera>}
     */
    static ConstructFromViewCamera(parameters: IModel, viewCamera : IThreeBaseCamera) : BaseCamera {

        parameters.name        = parameters.name        || "Camera";
        parameters.description = parameters.description || "Perspective Camera";

        let camera  = viewCamera instanceof THREE.PerspectiveCamera ?
            new PerspectiveCamera(parameters, <THREE.PerspectiveCamera> viewCamera) :
            new OrthographicCamera(parameters, <THREE.OrthographicCamera> viewCamera);

        camera.project = null;

        return camera;
    }

}
