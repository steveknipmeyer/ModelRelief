// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto from "DtoModels";
import * as THREE from "three";

import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {IThreeBaseCamera} from "Scripts/Graphics/IThreeBaseCamera";
import {BaseCamera, OrthographicCamera, PerspectiveCamera} from "Scripts/Models/Camera/Camera";
import {Project} from "Scripts/Models/Project/Project";

/**
 * Camera
 * Camera factory: instantiate a specialized BaseCamera.
 * @class
 */
export class CameraFactory {

    /**
     * @description Construct a camera (Orthographic, Perspective) from an Id.
     * @static
     * @param {number} id Camera Id.
     * @returns {Promise<BaseCamera>}
     */
    public static async ConstructFromIdAsync(id: number): Promise<BaseCamera> {

        const dtoCamera = await Dto.Camera.fromIdAsync(id);
        const camera = await CameraFactory.ConstructFromDtoModelAsync(dtoCamera);

        return camera;
    }

    /**
     * @description Construct a camera (Orthographic, Perspective) from a DTO Camera.
     * @static
     * @param {number} id Camera Id.
     * @returns {Promise<BaseCamera>}
     */
    public static async ConstructFromDtoModelAsync(dtoCamera: Dto.Camera): Promise<BaseCamera> {

        const viewCamera = dtoCamera.getViewCamera();
        const cameraParameters = {id: dtoCamera.id, name: dtoCamera.name, description: dtoCamera.description};
        const camera  = dtoCamera.isPerspective ?
            new PerspectiveCamera(cameraParameters, viewCamera as THREE.PerspectiveCamera) :
            new OrthographicCamera(cameraParameters, viewCamera as THREE.OrthographicCamera);

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
    public static ConstructFromViewCamera(parameters: IModel, viewCamera: IThreeBaseCamera): BaseCamera {

        parameters.name        = parameters.name        || "Camera";
        parameters.description = parameters.description || "Perspective Camera";

        const camera  = viewCamera instanceof THREE.PerspectiveCamera ?
            new PerspectiveCamera(parameters, viewCamera as THREE.PerspectiveCamera) :
            new OrthographicCamera(parameters, viewCamera as THREE.OrthographicCamera);

        camera.project = null;

        return camera;
    }

    /**
     * @constructor
     */
    constructor() {
    }

}
