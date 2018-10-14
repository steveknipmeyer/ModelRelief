// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto          from 'DtoModels'
import * as THREE        from 'three'

import { CameraHelper }                 from 'CameraHelper'
import { CameraSettings }               from 'Camerasettings'
import { DepthBufferFactory }           from 'DepthBufferFactory'
import { Graphics }                     from 'Graphics'
import { IModel }                       from 'IModel'
import { IThreeBaseCamera }             from 'IThreeBaseCamera'
import { Model }                        from 'Model'
import { Project }                      from 'Project'

/**
 * @description Camera clipping planes tuple.
 * @export
 * @interface ClippingPlanes
 */
export interface ClippingPlanes {
    near : number;
    far  : number;
}

/**
 * @description Camera
 * @export
 * @class Camera
 * @extends {Model}
 */
export class BaseCamera extends Model {

    viewCamera : IThreeBaseCamera;

    // Navigation Properties
    project    : Project;

    /**
     * @constructor
     * Creates an instance of Camera.
     * @param {IModel} parameters IModel properties.
     * @param {IThreeBaseCamera} camera IThreeBaseCamera.
     */
    constructor(parameters: IModel, camera : IThreeBaseCamera) {

        parameters.name        = parameters.name        || "Camera";
        parameters.description = parameters.description || "Perspective Camera";

        super(parameters);

        this.initialize(camera);
    }

    /**
     * @description Perform setup and initialization.
     * @param {IThreeBaseCamera} camera IThreeBaseCamera.
     */
    initialize (camera : IThreeBaseCamera) : void {

        this.viewCamera = camera;
    }

//#region Clipping Planes
    /**
     * @description Resets the clipping planes to the default values.
     */
    setDefaultClippingPlanes() {
        CameraHelper.setDefaultClippingPlanes(this.viewCamera);
    }

    /**
     * Returns the extents of the near camera plane.
     * @returns {THREE.Vector2}
     */
    getNearPlaneExtents() : THREE.Vector2 {

        return new THREE.Vector2(0, 0);
    }

    /**
     * Finds the bounding clipping planes for the given model.
     *
     */
    getBoundingClippingPlanes(model : THREE.Object3D) : ClippingPlanes{

        let cameraMatrixWorldInverse: THREE.Matrix4 = this.viewCamera.matrixWorldInverse;
        let boundingBoxView: THREE.Box3 = Graphics.getTransformedBoundingBox(model, cameraMatrixWorldInverse);

        // The bounding box is world-axis aligned.
        // In View coordinates, the camera is at the origin.
        // The bounding near plane is the maximum Z of the bounding box.
        // The bounding far plane is the minimum Z of the bounding box.
        let nearPlane = -boundingBoxView.max.z;
        let farPlane = -boundingBoxView.min.z;

        let clippingPlanes : ClippingPlanes = {

            // adjust by epsilon to avoid clipping geometry at the near plane edge
            near :  (1 - DepthBufferFactory.NearPlaneEpsilon) * nearPlane,
            far  : farPlane
        }
        return clippingPlanes;
    }

    /**
     * @description Finalize the camera clipping planes to fit the model if they are at the default values..
     * @static
     * @param {THREE.Group} modelGroup Target model.
     */
    finalizeClippingPlanes(modelGroup : THREE.Group) {

        let setNear = (this.viewCamera.near === CameraSettings.DefaultNearClippingPlane);
        let setFar  = (this.viewCamera.far === CameraSettings.DefaultFarClippingPlane);

        let clippingPlanes: ClippingPlanes = this.getBoundingClippingPlanes(modelGroup);
        if (setNear)
            this.viewCamera.near = clippingPlanes.near;
        if (setFar)
            this.viewCamera.far  = clippingPlanes.far;

        this.viewCamera.updateProjectionMatrix();
    }

//#endregion

    /**
     * @description Constructs an instance from a DTO model.
     * @returns {Camera}
     */
    static async fromDtoModelAsync(dtoCamera : Dto.Camera) : Promise<BaseCamera> {

        let position    = new THREE.Vector3(dtoCamera.positionX, dtoCamera.positionY, dtoCamera.positionZ);
        let quaternion  = new THREE.Quaternion(dtoCamera.eulerX, dtoCamera.eulerY, dtoCamera.eulerZ, dtoCamera.theta);
        let scale       = new THREE.Vector3(dtoCamera.scaleX, dtoCamera.scaleY, dtoCamera.scaleZ);
        let up          = new THREE.Vector3(dtoCamera.upX, dtoCamera.upY, dtoCamera.upZ);

        // construct PerspectiveCamera from DTO properties
        let viewCamera = dtoCamera.isPerspective ?
            new THREE.PerspectiveCamera(dtoCamera.fieldOfView, dtoCamera.aspectRatio, dtoCamera.near, dtoCamera.far) :
            new THREE.OrthographicCamera(dtoCamera.left, dtoCamera.right, dtoCamera.top, dtoCamera.bottom, dtoCamera.near, dtoCamera.far);

        viewCamera.matrix.compose(position, quaternion, scale);
        viewCamera.up.copy(up);

        // set position/rotation/scale attributes
        viewCamera.matrix.decompose(viewCamera.position, viewCamera.quaternion, viewCamera.scale);

        viewCamera.near   = dtoCamera.near;
        viewCamera.far    = dtoCamera.far;

        viewCamera.updateProjectionMatrix();

        // constructor
        let camera = new BaseCamera ({
            id          : dtoCamera.id,
            name        : dtoCamera.name,
            description : dtoCamera.description,
            },
            viewCamera
        );

        camera.project  = await Project.fromIdAsync(dtoCamera.projectId);

        return camera;
    }

    /**
     * @description Returns a DTO Camera model from the instance.
     * @returns {Dto.Camera}
     */
    toDtoModel() : Dto.Camera {

        let isPerspective  = this.viewCamera instanceof THREE.PerspectiveCamera;
        let isOrthographic = this.viewCamera instanceof THREE.OrthographicCamera;

        let position    = new THREE.Vector3();
        let quaternion  = new THREE.Quaternion();
        let scale       = new THREE.Vector3();
        let up          = new THREE.Vector3();
        this.viewCamera.matrix.decompose(position, quaternion, scale);
        up = this.viewCamera.up;

        let camera = new Dto.Camera({
            id              : this.id,
            name            : this.name,
            description     : this.description,
            isPerspective   : isPerspective,

            near            : this.viewCamera.near,
            far             : this.viewCamera.far,

            position        : position,
            quaternion      : quaternion,
            scale           : scale,
            up              : up,

            // Perpsective
            fieldOfView     : isPerspective? (<THREE.PerspectiveCamera>this.viewCamera).fov : CameraSettings.DefaultFieldOfView,
            aspectRatio     : isPerspective? (<THREE.PerspectiveCamera>this.viewCamera).aspect : 1.0,

            // Orthographic
            left            : isOrthographic? (<THREE.OrthographicCamera>this.viewCamera).left   : CameraSettings.DefaultLeftPlane,
            right           : isOrthographic? (<THREE.OrthographicCamera>this.viewCamera).right  : CameraSettings.DefaultRightPlane,
            top             : isOrthographic? (<THREE.OrthographicCamera>this.viewCamera).top    : CameraSettings.DefaultTopPlane,
            bottom          : isOrthographic? (<THREE.OrthographicCamera>this.viewCamera).bottom : CameraSettings.DefaultBottomPlane,

            projectId       : this.project ? this.project.id : undefined,
        });

        return camera;
    }
}
