// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";
import * as THREE from "three";

import {StandardView} from "Scripts/Api/V1/Interfaces/ICamera";
import {Graphics} from "Scripts/Graphics/Graphics";
import {IThreeBaseCamera} from "Scripts/Graphics/IThreeBaseCamera";
import {Defaults} from "Scripts/Models/Settings/Defaults";
import {IOrthographicFrustum} from "Scripts/Models/Settings/DefaultCameraSettings";
import {Format} from "Scripts/System/Format";
import {ILogger} from "Scripts/System/Logger";
import {Services} from "Scripts/System/Services";

/**
 * Camera
 * General camera utility methods.
 * @class
 */
export class CameraHelper {

    /**
     * @constructor
     */
    constructor() {
        // NOP
    }

//#region Clipping Planes
    /**
     * @description Resets the clipping planes to the default values.
     * @static
     * @param {IThreeBaseCamera} camera Camera to update.
     */
    public static setDefaultClippingPlanes(camera: IThreeBaseCamera): void {

        camera.near = Defaults.camera.nearClippingPlane;
        camera.far  = Defaults.camera.farClippingPlane;
    }
//#endregion

//#region Settings
    /**
     * @description Create the default bounding box for a model.
     * If the model is empty, a unit sphere is uses as a proxy to provide defaults.
     * @static
     * @param {THREE.Object3D} model Model to calculate bounding box.
     * @returns {THREE.Box3}
     */
    public static getDefaultBoundingBox(model: THREE.Object3D): THREE.Box3 {

        let boundingBox = new THREE.Box3();
        if (model)
            boundingBox = Graphics.getBoundingBoxFromObject(model);

        if (!boundingBox.isEmpty())
            return boundingBox;

        // unit sphere proxy
        const sphereProxy = Graphics.createSphereMesh(new THREE.Vector3(), 1);
        boundingBox = Graphics.getBoundingBoxFromObject(sphereProxy);

        return boundingBox;
    }

    /**
     * @description Updates the camera to fit the model in the current view.
     * @static
     * @param {IThreeBaseCamera} camera Camera to update.
     * @param {number} viewAspect Aspect ration of view.
     * @param {THREE.Group} modelGroup Model to fit.
     * @returns {IThreeBaseCamera}
     */
    public static getFitViewCamera(cameraTemplate: IThreeBaseCamera, viewAspect: number, modelGroup: THREE.Group): IThreeBaseCamera {

        const timerTag = Services.timer.mark("Camera.getFitViewCamera");

        const camera = cameraTemplate.clone(true);
        const boundingBoxWorld: THREE.Box3    = CameraHelper.getDefaultBoundingBox(modelGroup);
        const cameraMatrixWorld: THREE.Matrix4 = camera.matrixWorld;
        const cameraMatrixWorldInverse: THREE.Matrix4 = camera.matrixWorldInverse;

        // Find camera position in View coordinates...
        const boundingBoxView: THREE.Box3 = Graphics.getTransformedBoundingBox(modelGroup, cameraMatrixWorldInverse);
        const boundingBoxViewSize = boundingBoxView.getSize(new THREE.Vector3());
        const halfBoundingBoxViewXExtents  = boundingBoxViewSize.x / 2;
        const halfBoundingBoxViewYExtents  = boundingBoxViewSize.y / 2;

        // distance along Z from the model X/Y maximum; ensures entire model visible
        let newCameraZDistanceView: number;

        // Perspective
        if (camera instanceof THREE.PerspectiveCamera) {
            const verticalFieldOfViewRadians: number = (camera.fov / 2) * (Math.PI / 180);
            const horizontalFieldOfViewRadians: number = Math.atan(camera.aspect * Math.tan(verticalFieldOfViewRadians));

            const cameraZDistanceVerticalExtents: number = halfBoundingBoxViewYExtents / Math.tan (verticalFieldOfViewRadians);
            const cameraZDistanceHorizontalExtents: number = halfBoundingBoxViewXExtents / Math.tan (horizontalFieldOfViewRadians);
            newCameraZDistanceView = Math.max(cameraZDistanceVerticalExtents, cameraZDistanceHorizontalExtents);
        }

        // Orthographic
        if (camera instanceof THREE.OrthographicCamera) {

            // For orthographic cameras, Z has no effect on the view scale.
            // Instead, adjust the frustum planes to fit the model bounding box.
            camera.zoom = 1;

            const modelAspectRatio = halfBoundingBoxViewXExtents / halfBoundingBoxViewYExtents;
            let halfCameraX;
            let halfCameraY;
            if (modelAspectRatio > viewAspect) {
                halfCameraX = halfBoundingBoxViewXExtents;
                halfCameraY = halfCameraX * viewAspect;
            } else {
                halfCameraY = halfBoundingBoxViewYExtents;
                halfCameraX = halfCameraY / viewAspect;
            }
            camera.left   = -halfCameraX;
            camera.right  = +halfCameraX;
            camera.top    = +halfCameraY;
            camera.bottom = -halfCameraY;

            // Since the camera frustum encloses the entire model, the Z distance of an orthographic camera does not affect the scale.
            // However, a Z distance is chosen (from the front face of the model bounding box)  so that the camera can be rotated without clipping the model.
            newCameraZDistanceView = Math.max(boundingBoxView.getSize(new THREE.Vector3()).x, boundingBoxView.getSize(new THREE.Vector3()).y, boundingBoxView.getSize(new THREE.Vector3()).z);
        }

        // Preserve XY but set Z to enclose entire model.
        // Since the absolute Z position of the model X/Y extent maximum is not known, the Z distance is added to the front of the bounding box.
        // By enclosing the entire bounding box within the camera frustum, the entire model will be visible albeit scaled somewhat smaller than necessary.
        const previousCameraPositionView = camera.position.applyMatrix4(cameraMatrixWorldInverse);
        const newCameraPositionView = new THREE.Vector3(previousCameraPositionView.x, previousCameraPositionView.y, boundingBoxView.max.z + newCameraZDistanceView);

        // Now, transform back to World coordinates...
        const positionWorld = newCameraPositionView.applyMatrix4(cameraMatrixWorld);

        camera.position.copy (positionWorld);

        camera.lookAt(boundingBoxWorld.getCenter(new THREE.Vector3()));

        // force camera matrix to update; matrixAutoUpdate happens in render loop
        camera.updateMatrixWorld(true);
        camera.updateProjectionMatrix();

        Services.timer.logElapsedTime(timerTag);
        return camera;
    }

    /**
     * @description Returns the camera settings to fit the model in a standard view.
     * @static
     * @param {Camera.StandardView} view Standard view (Top, Left, etc.)
     * @param {THREE.Camera} viewCamera View camera.
     * @param {number} viewAspect Aspect ration of view.
     * @param {THREE.Object3D} modelGroup Model to fit.
     * @returns {IThreeBaseCamera}
     */
    public static getStandardViewCamera(view: StandardView, viewCamera: THREE.Camera, viewAspect: number, modelGroup: THREE.Group): IThreeBaseCamera {

        const timerTag = Services.timer.mark("Camera.getStandardView");

        let camera = CameraHelper.getDefaultCamera(viewAspect, !(viewCamera instanceof THREE.OrthographicCamera));
        const boundingBox = Graphics.getBoundingBoxFromObject(modelGroup);

        const boundingBoxCenter = boundingBox.getCenter(new THREE.Vector3());
        const centerX = boundingBoxCenter.x;
        const centerY = boundingBoxCenter.y;
        const centerZ = boundingBoxCenter.z;

        const minX = boundingBox.min.x;
        const minY = boundingBox.min.y;
        const minZ = boundingBox.min.z;
        const maxX = boundingBox.max.x;
        const maxY = boundingBox.max.y;
        const maxZ = boundingBox.max.z;

        switch (view) {
            case StandardView.Front: {
                camera.position.copy (new THREE.Vector3(centerX,  centerY, maxZ));
                camera.up.set(0, 1, 0);
                break;
            }
            case StandardView.Back: {
                camera.position.copy (new THREE.Vector3(centerX,  centerY, minZ));
                camera.up.set(0, 1, 0);
                break;
            }
            case StandardView.Top: {
                camera.position.copy (new THREE.Vector3(centerX,  maxY, centerZ));
                camera.up.set(0, 0, -1);
                break;
            }
            case StandardView.Bottom: {
                camera.position.copy (new THREE.Vector3(centerX, minY, centerZ));
                camera.up.set(0, 0, 1);
                break;
            }
            case StandardView.Left: {
                camera.position.copy (new THREE.Vector3(minX, centerY, centerZ));
                camera.up.set(0, 1, 0);
                break;
            }
            case StandardView.Right: {
                camera.position.copy (new THREE.Vector3(maxX, centerY, centerZ));
                camera.up.set(0, 1, 0);
                break;
            }
            case StandardView.Isometric: {
                const side = Math.max(Math.max(boundingBox.getSize(new THREE.Vector3()).x, boundingBox.getSize(new THREE.Vector3()).y), boundingBox.getSize(new THREE.Vector3()).z);
                camera.position.copy (new THREE.Vector3(side,  side, side));
                camera.up.set(-1, 1, -1);
                break;
            }

            default: {
                return viewCamera as IThreeBaseCamera;
            }
        }
        // Force orientation before Fit View calculation
        camera.lookAt(boundingBox.getCenter(new THREE.Vector3()));

        // force camera matrix to update; matrixAutoUpdate happens in render loop
        camera.updateMatrixWorld(true);
        camera.updateProjectionMatrix();

        camera = CameraHelper.getFitViewCamera(camera, viewAspect, modelGroup);

        Services.timer.logElapsedTime(timerTag);
        return camera;
    }

    /**
     * @description Creates a default scene camera.
     * @static
     * @param {THREE.Camera} viewAspect Aspect ratio of view.
     * @param {boolean} perspectiveCamera Create a perspective camera.
     * @returns {IThreeBaseCamera}
     */
    public static getDefaultCamera(viewAspect: number, perspectiveCamera: boolean = true): IThreeBaseCamera {

        let defaultCamera;
        if (perspectiveCamera) {
            defaultCamera = new THREE.PerspectiveCamera(Defaults.camera.fieldOfView, viewAspect, Defaults.camera.nearClippingPlane, Defaults.camera.farClippingPlane);
        } else {
            const frustum: IOrthographicFrustum = this.getDefaultOrthographicFrustum(viewAspect);
            defaultCamera = new THREE.OrthographicCamera(frustum.left, frustum.right, frustum.top, frustum.bottom, Defaults.camera.nearClippingPlane, Defaults.camera.farClippingPlane);
        }

        defaultCamera.position.copy (new THREE.Vector3 (0, 0, 0));
        defaultCamera.lookAt(new THREE.Vector3(0, 0, -1));

        // force camera matrix to update; matrixAutoUpdate happens in render loop
        defaultCamera.updateMatrixWorld(true);
        defaultCamera.updateProjectionMatrix();

        return defaultCamera;
    }

    /**
     * @description Returns the default frustum for an orthographic camera.
     * @static
     * @param {number} [viewAspect=1.0] Aspect ratio of view.
     * @returns {IOrthographicFrustum}
     */
    public static getDefaultOrthographicFrustum(viewAspect: number = 1.0): IOrthographicFrustum {
        const frustum: IOrthographicFrustum = {
            left:   -Defaults.camera.orthographicFrustumPlaneOffset,
            right:  +Defaults.camera.orthographicFrustumPlaneOffset,
            top:    +Defaults.camera.orthographicFrustumPlaneOffset / viewAspect,
            bottom: -Defaults.camera.orthographicFrustumPlaneOffset / viewAspect,
        };
        return frustum;
    }

    /**
     * @description Sets the default frustum for an orthographic camera.
     * @static
     * @param {THREE.OrthographicCamera} camera The Orthographic camera to modify.
     * @param {number} [viewAspect=1.0] Aspect ratio of view.
     */
    public static setDefaultOrthographicFrustum(camera: THREE.OrthographicCamera, viewAspect: number): void {
        const frustum: IOrthographicFrustum = this.getDefaultOrthographicFrustum(viewAspect);
        camera.left = frustum.left;
        camera.right = frustum.right;
        camera.top = frustum.top;
        camera.bottom = frustum.bottom;
    }

    /**
     * @description Get the camera lookAt point.
     * @static
     * @param {THREE.Camera} camera Active camera.
     * @param {THREE.Group} modelGroup Active model.
     */
    public static getLookAt(camera: THREE.Camera, modelGroup: THREE.Group): THREE.Vector3 {

        // Default camera view: -Z
        const unitLookAt = new THREE.Vector3(0, 0, -1);

        // apply camera rotation
        unitLookAt.applyQuaternion(camera.quaternion);

        // scale by the offset along the camera direction to the bounding box center
        const boundingBox: THREE.Box3 = Graphics.getBoundingBoxFromObject(modelGroup);
        const boundingBoxCenter = boundingBox.getCenter(new THREE.Vector3());

        const boundingBoxOffset = boundingBoxCenter.sub(camera.position);
        const cameraDirectionOffset = boundingBoxOffset.dot(unitLookAt);
        const scaledLookAt = unitLookAt.setLength(cameraDirectionOffset);
        // const scaledLookAt = unitLookAt;

        // The lookAt is not a direction vector it is a point in world space so translate to the camera position.
        const lookAt = scaledLookAt.add(camera.position);

        return lookAt;
    }

    /**
     * @description Debug support for displaying the properties of a camera.
     * @param {ILogger} logger Logger to use.
     * @param {IThreeBaseCamera} camera Target camera.
     * @param {THREE.Group} modelGroup Active model.
     * @param {string} tag Debug label.
     */
    public static debugCameraProperties(logger: ILogger, camera: IThreeBaseCamera, modelGroup: THREE.Group, tag: string): void {

        const headerStyle   = "font-family : monospace; font-weight : bold; color : yellow; font-size : 16px";
        const messageStyle  = "font-family : monospace; color : white; font-size : 12px";
        const isPerspective = camera instanceof THREE.PerspectiveCamera;
        const cameraType = isPerspective ? "Perspective" : "Orthographic";

        logger.addMessage(`${tag}: Camera Properties`, headerStyle);
        logger.addMessage(`Type = ${cameraType}`, messageStyle);
        // logger.addMessage(`Near Plane = ${camera.near}`, messageStyle);
        // logger.addMessage(`Far Plane = ${camera.far}`, messageStyle);
        // logger.addEmptyLine();

        // if (isPerspective) {
        //     const perspectiveCamera = camera as THREE.PerspectiveCamera;
        //     logger.addMessage(`Field Of View = ${perspectiveCamera.fov}`, messageStyle);
        //     logger.addMessage(`Aspect Ratio = ${perspectiveCamera.aspect}`, messageStyle);
        // } else {
        //     const orthographicCamera = camera as THREE.OrthographicCamera;
        //     logger.addMessage(`Left = ${Format.formatNumber(orthographicCamera.left)}`, messageStyle);
        //     logger.addMessage(`Right = ${Format.formatNumber(orthographicCamera.right)}`, messageStyle);
        //     logger.addMessage(`Top = ${Format.formatNumber(orthographicCamera.top)}`, messageStyle);
        //     logger.addMessage(`Bottom = ${Format.formatNumber(orthographicCamera.bottom)}`, messageStyle);
        // }
        // logger.addEmptyLine();

        logger.addMessage(`${Format.formatVector3("Position", camera.position)}`, messageStyle);
        logger.addMessage(`${Format.formatVector3("LookAt", CameraHelper.getLookAt(camera, modelGroup))}`, messageStyle);
        logger.addMessage(`${Format.formatVector3("Up", camera.up)}`, messageStyle);
        logger.addMessage(`${Format.formatVector4("Q", new THREE.Vector4(camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w))}`, messageStyle);

        // logger.addMessage(`${Format.formatVector3("Scale", camera.scale)}`, messageStyle);
    }
//#endregion
}
