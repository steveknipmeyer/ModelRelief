// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";
import * as THREE from "three";

import {StandardView} from "Scripts/Api/V1/Interfaces/ICamera";
import {Graphics} from "Scripts/Graphics/Graphics";
import {IThreeBaseCamera} from "Scripts/Graphics/IThreeBaseCamera";
import {CameraSettings} from "Scripts/Models/Camera/Camerasettings";
import {Services} from "Scripts/System/Services";

/**
 * Camera
 * General camera utility methods.
 * @class
 */
export class CameraHelper {

//#region Clipping Planes
    /**
     * @description Resets the clipping planes to the default values.
     * @static
     * @param {IThreeBaseCamera} camera Camera to update.
     */
    public static setDefaultClippingPlanes(camera: IThreeBaseCamera) {

        camera.near = CameraSettings.DefaultNearClippingPlane;
        camera.far  = CameraSettings.DefaultFarClippingPlane;
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
     * @param {THREE.Group} modelGroup Model to fit.
     * @returns {IThreeBaseCamera}
     */
    public static getFitViewCamera(cameraTemplate: IThreeBaseCamera, modelGroup: THREE.Group): IThreeBaseCamera {

        const timerTag = Services.timer.mark("Camera.getFitViewCamera");

        const camera = cameraTemplate.clone(true);
        const boundingBoxWorld: THREE.Box3    = CameraHelper.getDefaultBoundingBox(modelGroup);
        const cameraMatrixWorld: THREE.Matrix4 = camera.matrixWorld;
        const cameraMatrixWorldInverse: THREE.Matrix4 = camera.matrixWorldInverse;

        // Find camera position in View coordinates...
        const boundingBoxView: THREE.Box3 = Graphics.getTransformedBoundingBox(modelGroup, cameraMatrixWorldInverse);
        const halfBoundingBoxViewXExtents  = boundingBoxView.getSize().x / 2;
        const halfBoundingBoxViewYExtents  = boundingBoxView.getSize().y / 2;

        // new postion of camera in View coordinats
        let newCameraZView: number;

        // Perspective
        if (camera instanceof THREE.PerspectiveCamera) {
            const verticalFieldOfViewRadians: number = (camera.fov / 2) * (Math.PI / 180);
            const horizontalFieldOfViewRadians: number = Math.atan(camera.aspect * Math.tan(verticalFieldOfViewRadians));

            const cameraZVerticalExtents: number = halfBoundingBoxViewYExtents / Math.tan (verticalFieldOfViewRadians);
            const cameraZHorizontalExtents: number = halfBoundingBoxViewXExtents / Math.tan (horizontalFieldOfViewRadians);
            newCameraZView = Math.max(cameraZVerticalExtents, cameraZHorizontalExtents);

            // preserve XY; set Z to include extents
            const previousCameraPositionView = camera.position.applyMatrix4(cameraMatrixWorldInverse);
            const newCameraPositionView = new THREE.Vector3(previousCameraPositionView.x, previousCameraPositionView.y, boundingBoxView.max.z + newCameraZView);

            // Now, transform back to World coordinates...
            const positionWorld = newCameraPositionView.applyMatrix4(cameraMatrixWorld);

            camera.position.copy (positionWorld);
        }

        // Orthographic
        if (camera instanceof THREE.OrthographicCamera) {
            // For orthographic cameras, Z has no effect on the view scale.
            // Instead, adjust the clipping planes to fit the model bounding box.

            camera.left   = -halfBoundingBoxViewXExtents;
            camera.right  = +halfBoundingBoxViewXExtents;
            camera.top    = +halfBoundingBoxViewYExtents;
            camera.bottom = -halfBoundingBoxViewYExtents;
        }

        camera.lookAt(boundingBoxWorld.getCenter());

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
     * @param {THREE.Object3D} modelGroup Model to fit.
     * @returns {IThreeBaseCamera}
     */
    public static getStandardViewCamera(view: StandardView, viewCamera: THREE.Camera, modelGroup: THREE.Group): IThreeBaseCamera {

        const timerTag = Services.timer.mark("Camera.getStandardView");

        let camera = CameraHelper.getDefaultCamera(viewCamera);
        const boundingBox = Graphics.getBoundingBoxFromObject(modelGroup);

        const centerX = boundingBox.getCenter().x;
        const centerY = boundingBox.getCenter().y;
        const centerZ = boundingBox.getCenter().z;

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
                const side = Math.max(Math.max(boundingBox.getSize().x, boundingBox.getSize().y), boundingBox.getSize().z);
                camera.position.copy (new THREE.Vector3(side,  side, side));
                camera.up.set(-1, 1, -1);
                break;
            }
        }
        // Force orientation before Fit View calculation
        camera.lookAt(boundingBox.getCenter());

        // force camera matrix to update; matrixAutoUpdate happens in render loop
        camera.updateMatrixWorld(true);
        camera.updateProjectionMatrix();

        camera = CameraHelper.getFitViewCamera(camera, modelGroup);

        Services.timer.logElapsedTime(timerTag);
        return camera;
    }

    /**
     * @description Creates a default scene camera.
     * @static
     * @param {THREE.Camera} viewCamera View camera.
     * @returns {IThreeBaseCamera}
     */
    public static getDefaultCamera(viewCamera: THREE.Camera): IThreeBaseCamera {

        // default matches existing camera if it exists
        const isPerspective: boolean = viewCamera ? (viewCamera instanceof THREE.PerspectiveCamera) : true;
        const aspectRatio: number = (viewCamera && (viewCamera instanceof THREE.PerspectiveCamera)) ? viewCamera.aspect : 1.0;

        const defaultCamera = isPerspective ?
            new THREE.PerspectiveCamera(CameraSettings.DefaultFieldOfView, aspectRatio, CameraSettings.DefaultNearClippingPlane, CameraSettings.DefaultFarClippingPlane) :
            new THREE.OrthographicCamera(CameraSettings.DefaultLeftPlane, CameraSettings.DefaultRightPlane, CameraSettings.DefaultTopPlane, CameraSettings.DefaultBottomPlane,
                                         CameraSettings.DefaultNearClippingPlane, CameraSettings.DefaultFarClippingPlane);

        defaultCamera.position.copy (new THREE.Vector3 (0, 0, 0));
        defaultCamera.lookAt(new THREE.Vector3(0, 0, -1));

        // force camera matrix to update; matrixAutoUpdate happens in render loop
        defaultCamera.updateMatrixWorld(true);
        defaultCamera.updateProjectionMatrix();

        return defaultCamera;
    }

    /**
     * @constructor
     */
    constructor() {
    }
//#endregion
}
