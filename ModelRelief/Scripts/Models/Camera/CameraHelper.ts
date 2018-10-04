// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE        from 'three'

import { BaseCamera, ClippingPlanes, IThreeBaseCamera} from 'BaseCamera'
import { DepthBufferFactory }                          from 'DepthBufferFactory'
import { Graphics }                                    from 'Graphics'
import {StandardView}                                  from "ICamera"
import { OrthographicCamera}                           from 'OrthographicCamera'
import { PerspectiveCamera}                            from 'PerspectiveCamera'
import { Services }                                    from 'Services'
import { Viewer }                                      from 'Viewer'

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
    }

//#region Clipping Planes
    /**
     * @description Resets the clipping planes to the default values.
     * @static
     * @param {IThreeBaseCamera} camera Camera to update.
     */
    static setDefaultClippingPlanes(camera : IThreeBaseCamera) {

        camera.near = BaseCamera.DefaultNearClippingPlane;
        camera.far  = BaseCamera.DefaultFarClippingPlane;
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
    static getDefaultBoundingBox (model : THREE.Object3D) : THREE.Box3 {

        let boundingBox = new THREE.Box3();
        if (model)
            boundingBox = Graphics.getBoundingBoxFromObject(model);

        if (!boundingBox.isEmpty())
            return boundingBox;

        // unit sphere proxy
        let sphereProxy = Graphics.createSphereMesh(new THREE.Vector3(), 1);
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
    static getFitViewCamera (cameraTemplate : IThreeBaseCamera, modelGroup : THREE.Group) : IThreeBaseCamera {

        let timerTag = Services.timer.mark('Camera.getFitViewCamera');

        let camera = cameraTemplate.clone(true);
        let boundingBoxWorld         : THREE.Box3    = CameraHelper.getDefaultBoundingBox(modelGroup);
        let cameraMatrixWorld        : THREE.Matrix4 = camera.matrixWorld;
        let cameraMatrixWorldInverse : THREE.Matrix4 = camera.matrixWorldInverse;

        // Find camera position in View coordinates...
        let boundingBoxView: THREE.Box3 = Graphics.getTransformedBoundingBox(modelGroup, cameraMatrixWorldInverse);
        let halfBoundingBoxViewXExtents  = boundingBoxView.getSize().x / 2;
        let halfBoundingBoxViewYExtents  = boundingBoxView.getSize().y / 2;

        // new postion of camera in View coordinats
        let newCameraZView : number;

        // Perspective
        if (camera instanceof THREE.PerspectiveCamera) {
            let verticalFieldOfViewRadians   : number = (camera.fov / 2) * (Math.PI / 180);
            let horizontalFieldOfViewRadians : number = Math.atan(camera.aspect * Math.tan(verticalFieldOfViewRadians));

            let cameraZVerticalExtents   : number = halfBoundingBoxViewYExtents / Math.tan (verticalFieldOfViewRadians);
            let cameraZHorizontalExtents : number = halfBoundingBoxViewXExtents / Math.tan (horizontalFieldOfViewRadians);
            newCameraZView = Math.max(cameraZVerticalExtents, cameraZHorizontalExtents);

            // preserve XY; set Z to include extents
            let previousCameraPositionView = camera.position.applyMatrix4(cameraMatrixWorldInverse);
            let newCameraPositionView = new THREE.Vector3(previousCameraPositionView.x, previousCameraPositionView.y, boundingBoxView.max.z + newCameraZView);

            // Now, transform back to World coordinates...
            let positionWorld = newCameraPositionView.applyMatrix4(cameraMatrixWorld);

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
     * @param {Viewer} Target view.
     * @param {THREE.Object3D} modelGroup Model to fit.
     * @returns {IThreeBaseCamera}
     */
    static getStandardViewCamera (view: StandardView, viewer : Viewer, modelGroup : THREE.Group) : IThreeBaseCamera {

        let timerTag = Services.timer.mark('Camera.getStandardView');

        let camera = CameraHelper.getDefaultCamera(viewer);
        let boundingBox = Graphics.getBoundingBoxFromObject(modelGroup);

        let centerX = boundingBox.getCenter().x;
        let centerY = boundingBox.getCenter().y;
        let centerZ = boundingBox.getCenter().z;

        let minX = boundingBox.min.x;
        let minY = boundingBox.min.y;
        let minZ = boundingBox.min.z;
        let maxX = boundingBox.max.x;
        let maxY = boundingBox.max.y;
        let maxZ = boundingBox.max.z;

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
                let side = Math.max(Math.max(boundingBox.getSize().x, boundingBox.getSize().y), boundingBox.getSize().z);
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
     * @param {Viewer} Target view.
     * @returns {IThreeBaseCamera}
     */
    static getDefaultCamera (viewer : Viewer) : IThreeBaseCamera {

        // default matches existing camera if it exists
        let isPerspective : boolean = viewer.camera ? (viewer.camera instanceof THREE.PerspectiveCamera) : true;

        let defaultCamera = isPerspective ?
            new THREE.PerspectiveCamera(PerspectiveCamera.DefaultFieldOfView, viewer.aspectRatio, BaseCamera.DefaultNearClippingPlane, BaseCamera.DefaultFarClippingPlane) :
            new THREE.OrthographicCamera(OrthographicCamera.DefaulLeftPlane, OrthographicCamera.DefaulRightPlane, OrthographicCamera.DefaulTopPlane, OrthographicCamera.DefaulBottomPlane,
                                         BaseCamera.DefaultNearClippingPlane, BaseCamera.DefaultFarClippingPlane);

        defaultCamera.position.copy (new THREE.Vector3 (0, 0, 0));
        defaultCamera.lookAt(new THREE.Vector3(0, 0, -1));

        // force camera matrix to update; matrixAutoUpdate happens in render loop
        defaultCamera.updateMatrixWorld(true);
        defaultCamera.updateProjectionMatrix;

        return defaultCamera;
    }
//#endregion
}
