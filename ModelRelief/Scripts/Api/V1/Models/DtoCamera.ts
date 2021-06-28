// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";

import {DtoModel} from "Scripts/Api/V1/Base/DtoModel";
import {ICamera} from "Scripts/Api/V1/Interfaces/ICamera";
import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {IProject} from "Scripts/Api/V1/Interfaces/IProject";
import {IThreeBaseCamera} from "Scripts/Graphics/IThreeBaseCamera";
import {HttpLibrary, ServerEndPoints} from "Scripts/System/Http";
import * as THREE from "three";

/**
 * Concrete implementation of ICamera.
 * @class
 */
export class DtoCamera extends DtoModel<DtoCamera> implements ICamera {

    /**
     * @description Returns a Camera instance through an HTTP query of the Id.
     * @static
     * @param {number} id Camera Id.
     * @returns {Promise<BaseCamera>}
     */
    public static async fromIdAsync(id: number): Promise<DtoCamera> {

        if (!id)
            return undefined;

        const camera = new DtoCamera({
            id,
        });
        const cameraModel = await camera.getAsync();
        return cameraModel;
    }

    public isPerspective: boolean;

    public near: number;
    public far: number;

    public positionX: number;
    public positionY: number;
    public positionZ: number;

    public eulerX: number;
    public eulerY: number;
    public eulerZ: number;
    public theta: number;

    public scaleX: number;
    public scaleY: number;
    public scaleZ: number;

    public upX: number;
    public upY: number;
    public upZ: number;

    // Perspective
    public fieldOfView: number;
    public aspectRatio: number;

    // Orthographic
    public left: number;
    public right: number;
    public top: number;
    public bottom: number;

    // Navigation Properties
    public projectId: number;
    public project: IProject;

    /**
     * Creates an instance of Camera.
     * @param {ICamera} parameters
     */
    constructor(parameters: ICamera = {}) {

        super(parameters);

        this.endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiCameras}`;

        const {
            isPerspective,

            near,
            far,

            position,
            positionX,
            positionY,
            positionZ,

            quaternion,
            eulerX,
            eulerY,
            eulerZ,
            theta,

            scale,
            scaleX,
            scaleY,
            scaleZ,

            up,
            upX,
            upY,
            upZ,

            // Perspective
            fieldOfView,
            aspectRatio,

            // Orthographic
            left,
            right,
            top,
            bottom,

            // Navigation Properties
            projectId,
            project,
        } = parameters;

        this.isPerspective = isPerspective;

        this.near = near;
        this.far = far;

        this.positionX = position ? position.x : positionX;
        this.positionY = position ? position.y : positionY;
        this.positionZ = position ? position.z : positionZ;

        this.eulerX = quaternion ? quaternion.x : eulerX;
        this.eulerY = quaternion ? quaternion.y : eulerY;
        this.eulerZ = quaternion ? quaternion.z : eulerZ;
        this.theta = quaternion ? quaternion.w : theta;

        this.scaleX = scale ? scale.x : scaleX;
        this.scaleY = scale ? scale.y : scaleY;
        this.scaleZ = scale ? scale.z : scaleZ;

        this.upX = up ? up.x : upX;
        this.upY = up ? up.y : upY;
        this.upZ = up ? up.z : upZ;

        // Perspective
        this.fieldOfView = fieldOfView;
        this.aspectRatio = aspectRatio;

        // Orthographic
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;

        // Navigation Properties
        this.projectId = projectId;
        this.project = project;
    }

    /**
     * @description Constructs an instance of a Camera.
     * @param {IModel} parameters : DtoCamera
     * @returns {DtoCamera}
     */
    public factory(parameters: IModel): DtoCamera {
        return new DtoCamera(parameters);
    }

    /**
     * @description Constructs an instance from a DTO model.
     * @returns {DtoCamera}
     */
    public getViewCamera(): IThreeBaseCamera {

        const position = new THREE.Vector3(this.positionX, this.positionY, this.positionZ);
        const quaternion = new THREE.Quaternion(this.eulerX, this.eulerY, this.eulerZ, this.theta);
        const scale = new THREE.Vector3(this.scaleX, this.scaleY, this.scaleZ);
        const up = new THREE.Vector3(this.upX, this.upY, this.upZ);

        // construct from DTO properties
        const viewCamera = this.isPerspective ?
            new THREE.PerspectiveCamera(this.fieldOfView, this.aspectRatio, this.near, this.far) :
            new THREE.OrthographicCamera(this.left, this.right, this.top, this.bottom, this.near, this.far);

        viewCamera.matrix.compose(position, quaternion, scale);
        viewCamera.up.copy(up);

        // set position/quaternion/scale attributes
        viewCamera.matrix.decompose(viewCamera.position, viewCamera.quaternion, viewCamera.scale);

        viewCamera.near = this.near;
        viewCamera.far = this.far;

        viewCamera.updateProjectionMatrix();

        return viewCamera;
    }
}
