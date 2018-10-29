// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto from "Scripts/Api/V1//Models/DtoModels";
import * as THREE from "three";

import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {IThreeBaseCamera} from "Scripts/Graphics/IThreeBaseCamera";
import {BaseCamera} from "Scripts/Models/Camera/BaseCamera";
import {OrthographicCamera} from "Scripts/Models/Camera/OrthographicCamera";
import {PerspectiveCamera} from "Scripts/Models/Camera/PerspectiveCamera";

import {Project} from "Scripts/Models/Project/Project";

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
    public static async constructFromIdAsync(id: number): Promise<BaseCamera> {

        const dtoCamera = await Dto.Camera.fromIdAsync(id);
        const camera = await CameraFactory.constructFromDtoModelAsync(dtoCamera);

        return camera;
    }

    /**
     * @description Construct a camera (Orthographic, Perspective) from a DTO Camera.
     * @static
     * @param {number} id Camera Id.
     * @returns {Promise<BaseCamera>}
     */
    public static async constructFromDtoModelAsync(dtoCamera: Dto.Camera): Promise<BaseCamera> {

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
    public static constructFromViewCamera(parameters: IModel, viewCamera: IThreeBaseCamera): BaseCamera {

        parameters.name        = parameters.name        || "Camera";
        parameters.description = parameters.description || "Perspective Camera";

        const camera  = viewCamera instanceof THREE.PerspectiveCamera ?
            new PerspectiveCamera(parameters, viewCamera as THREE.PerspectiveCamera) :
            new OrthographicCamera(parameters, viewCamera as THREE.OrthographicCamera);

        camera.project = null;

        return camera;
    }

    /**
     * @description Toggles the projection mode of the camera (Perspective <-> Orthographic)
     * @param {IThreeBaseCamera} camera Camera to swap projection.
     * @returns {IThreeBaseCamera}
     */
    public static constructViewCameraOppositeProjection(camera: IThreeBaseCamera): IThreeBaseCamera {

        const sourceCamera: BaseCamera = CameraFactory.constructFromViewCamera({}, camera);

        const newDtoCamera: Dto.Camera = sourceCamera.toDtoModel();
        newDtoCamera.isPerspective = !newDtoCamera.isPerspective;
        const newCamera = newDtoCamera.getViewCamera();

        if (newCamera instanceof THREE.PerspectiveCamera) {
            // Orthographic -> Perspective
        } else {
            // Perspective -> Orthographic
            const orthograpicCamera = newCamera as THREE.OrthographicCamera;

            // extents of existing Perspective camera clipping planes will define Orthographic camera boundary
            orthograpicCamera.zoom = 1;

            const nearPlaneExtents = sourceCamera.getNearPlaneExtents();
            orthograpicCamera.left   = -nearPlaneExtents.x / 2;
            orthograpicCamera.right  = +nearPlaneExtents.x / 2;
            orthograpicCamera.top    = +nearPlaneExtents.y / 2;
            orthograpicCamera.bottom = -nearPlaneExtents.y / 2;
        }
        newCamera.updateProjectionMatrix();

        return newCamera;
    }
}
