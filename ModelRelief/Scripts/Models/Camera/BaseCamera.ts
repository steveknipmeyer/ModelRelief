// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {assert} from "chai";
import * as Dto from "Scripts/Api/V1//Models/DtoModels";
import * as THREE from "three";

import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {Model} from "Scripts/Api/V1/Models/Model";
import {Graphics} from "Scripts/Graphics/Graphics";
import {IThreeBaseCamera} from "Scripts/Graphics/IThreeBaseCamera";
import {CameraHelper} from "Scripts/Models/Camera/CameraHelper";
import {CameraSettings} from "Scripts/Models/Camera/Camerasettings";
import {DepthBufferFactorySettings} from "Scripts/Models/DepthBuffer/DepthBufferFactorySettings";
import {Project} from "Scripts/Models/Project/Project";

/**
 * @description Camera clipping planes tuple.
 * @export
 * @interface ClippingPlanes
 */
export interface IClippingPlanes {
    near: number;
    far: number;
}

/**
 * @description Camera
 * @export
 * @class Camera
 * @extends {Model}
 */
export abstract class BaseCamera extends Model {

    public viewCamera: IThreeBaseCamera;

    // Navigation Properties
    public project: Project;

    /**
     * @constructor
     * Creates an instance of Camera.
     * @param {IModel} parameters IModel properties.
     * @param {IThreeBaseCamera} camera IThreeBaseCamera.
     */
    constructor(parameters: IModel, camera: IThreeBaseCamera) {

        parameters.name        = parameters.name        || "Camera";
        parameters.description = parameters.description || "Perspective Camera";

        super(parameters);

        this.initialize(camera);
    }

//#region Properties
    /**
     * @description Returns whether the view camera is perpective (and not orthographic).
     * @readonly
     * @type {boolean}
     */
    get isPerspective(): boolean {

        return this.viewCamera ? this.viewCamera instanceof THREE.PerspectiveCamera : true;
    }

    // N.B. A BaseCamera does not implement a setter for isPerspective to avoid circular dependencies (e.g. Camera <-> CameraFactory).

//#endregion

    /**
     * @description Perform setup and initialization.
     * @param {IThreeBaseCamera} camera IThreeBaseCamera.
     */
    public initialize(camera: IThreeBaseCamera): void {

        this.viewCamera = camera;
    }

//#region Clipping Planes
    /**
     * @description Resets the clipping planes to the default values.
     */
    public setDefaultClippingPlanes() {
        CameraHelper.setDefaultClippingPlanes(this.viewCamera);
    }

    /**
     * Returns the extents of the near camera plane.
     * @returns {THREE.Vector2}
     */
    public getNearPlaneExtents(): THREE.Vector2 {
        return new THREE.Vector2(0, 0);
    }

    /**
     * Returns the extents of the far camera plane.
     * @returns {THREE.Vector2}
     */
    public getFarPlaneExtents(): THREE.Vector2 {

        return new THREE.Vector2(0, 0);
    }

    /**
     * Finds the bounding clipping planes for the given model.
     *
     */
    public getBoundingClippingPlanes(model: THREE.Object3D): IClippingPlanes {

        const cameraMatrixWorldInverse: THREE.Matrix4 = this.viewCamera.matrixWorldInverse;
        const boundingBoxView: THREE.Box3 = Graphics.getTransformedBoundingBox(model, cameraMatrixWorldInverse);

        // The bounding box is world-axis aligned.
        // In View coordinates, the camera is at the origin.
        // The bounding near plane is the maximum Z of the bounding box.
        // The bounding far plane is the minimum Z of the bounding box.
        let nearPlane   = -boundingBoxView.max.z;
        const farPlane  = -boundingBoxView.min.z;

        // validate near plane
        const validNearPlane: boolean = nearPlane >= CameraSettings.DefaultNearClippingPlane;
        if (!validNearPlane) {
            console.log(`getBoundedClippingPlanes: nearPlane = ${nearPlane}`);
            nearPlane = CameraSettings.DefaultNearClippingPlane;
        }
        const clippingPlanes: IClippingPlanes = {

            // adjust by epsilon to avoid clipping geometry at the near plane edge
            near :  (1 - DepthBufferFactorySettings.NearPlaneEpsilon) * nearPlane,
            far  : farPlane,
        };
        return clippingPlanes;
    }

    /**
     * @description Finalize the camera clipping planes to fit the model if they are at the default values..
     * @param {THREE.Group} modelGroup Target model.
     */
    public finalizeClippingPlanes(modelGroup: THREE.Group) {

        const setNear = (this.viewCamera.near === CameraSettings.DefaultNearClippingPlane);
        const setFar  = (this.viewCamera.far === CameraSettings.DefaultFarClippingPlane);

        const clippingPlanes: IClippingPlanes = this.getBoundingClippingPlanes(modelGroup);
        if (setNear)
            this.viewCamera.near = clippingPlanes.near;
        if (setFar)
            this.viewCamera.far  = clippingPlanes.far;

        this.viewCamera.updateProjectionMatrix();
    }

//#endregion

    /**
     * @description Returns a DTO Camera model from the instance.
     * @returns {Dto.Camera}
     */
    public toDtoModel(): Dto.Camera {

        const isPerspective  = this.isPerspective;
        const isOrthographic = this.viewCamera instanceof THREE.OrthographicCamera;

        const position    = new THREE.Vector3();
        const quaternion  = new THREE.Quaternion();
        const scale       = new THREE.Vector3();
        let up          = new THREE.Vector3();
        this.viewCamera.matrix.decompose(position, quaternion, scale);
        up = this.viewCamera.up;

        const camera = new Dto.Camera({
            id              : this.id,
            name            : this.name,
            description     : this.description,
            isPerspective,

            near            : this.viewCamera.near,
            far             : this.viewCamera.far,

            position,
            quaternion,
            scale,
            up,

            // Perpsective
            fieldOfView     : isPerspective ? (this.viewCamera as THREE.PerspectiveCamera).fov : CameraSettings.DefaultFieldOfView,
            aspectRatio     : isPerspective ? (this.viewCamera as THREE.PerspectiveCamera).aspect : 1.0,

            // Orthographic
            left            : isOrthographic ? (this.viewCamera as THREE.OrthographicCamera).left   : CameraSettings.DefaultLeftPlane,
            right           : isOrthographic ? (this.viewCamera as THREE.OrthographicCamera).right  : CameraSettings.DefaultRightPlane,
            top             : isOrthographic ? (this.viewCamera as THREE.OrthographicCamera).top    : CameraSettings.DefaultTopPlane,
            bottom          : isOrthographic ? (this.viewCamera as THREE.OrthographicCamera).bottom : CameraSettings.DefaultBottomPlane,

            projectId       : this.project ? this.project.id : undefined,
        });

        return camera;
    }
}


