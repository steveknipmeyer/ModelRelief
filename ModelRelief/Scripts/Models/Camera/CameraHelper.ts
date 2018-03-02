// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE        from 'three'

import { Camera, ClippingPlanes} from 'Camera'
import { DepthBufferFactory }    from 'DepthBufferFactory'
import { Graphics }              from 'Graphics'
import {StandardView}            from "ICamera"
import { Services }              from 'Services'
import { StopWatch }             from 'StopWatch'

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
     * Returns the extents of the near camera plane.
     * @static
     * @param {THREE.PerspectiveCamera} camera Camera.
     * @returns {THREE.Vector2} 
     * @memberof Graphics
     */
    static getNearPlaneExtents(camera : THREE.PerspectiveCamera) : THREE.Vector2 {
        
        let cameraFOVRadians = camera.fov * (Math.PI / 180);
    
        let nearHeight = 2 * Math.tan(cameraFOVRadians / 2) * camera.near;
        let nearWidth  = camera.aspect * nearHeight;
        let extents = new THREE.Vector2(nearWidth, nearHeight);
        
        return extents;       
    }

    /** 
     * Finds the bounding clipping planes for the given model. 
     * 
     */
    static getBoundingClippingPlanes(camera : THREE.PerspectiveCamera, model : THREE.Object3D) : ClippingPlanes{

        let cameraMatrixWorldInverse: THREE.Matrix4 = camera.matrixWorldInverse;
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
     * @description Bounds the camera clipping planes to fit the model.
     * @static
     * @param {THREE.PerspectiveCamera} camera 
     * @param {THREE.Group} modelGroup 
     * @param {boolean} setNear Set the near plane to the model extents.
     * @param {boolean} setFar Set the far plane to the model extents.
     */
    static boundClippingPlanes(camera: THREE.PerspectiveCamera, modelGroup : THREE.Group, setNear : boolean, setFar : boolean) {

        let clippingPlanes: ClippingPlanes = this.getBoundingClippingPlanes(camera, modelGroup);
        if (setNear)
            camera.near = clippingPlanes.near;
        if (setFar)            
            camera.far  = clippingPlanes.far;

        camera.updateProjectionMatrix();
    }

    /**
     * @description Finalize the camera clipping planes to fit the model if they are at the default values..
     * @static
     * @param {THREE.PerspectiveCamera} camera Camera to optimize clipping planes.
     * @param {THREE.Group} modelGroup Target model.
     */
    static finalizeClippingPlanes(camera: THREE.PerspectiveCamera, modelGroup : THREE.Group) {

        let setNear = (camera.near === Camera.DefaultNearClippingPlane);
        let setFar  = (camera.far === Camera.DefaultFarClippingPlane);

        CameraHelper.boundClippingPlanes(camera, modelGroup, setNear, setFar);
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
     * @param {THREE.PerspectiveCamera} camera Camera to update.
     * @param {THREE.Group} modelGroup Model to fit.
     * @returns {THREE.PerspectiveCamera} 
     */
    static getFitViewCamera (cameraTemplate : THREE.PerspectiveCamera, modelGroup : THREE.Group) : THREE.PerspectiveCamera { 

        let timerTag = Services.timer.mark('Camera.getFitViewCamera');              

        let camera = cameraTemplate.clone(true);
        let boundingBoxWorld         : THREE.Box3    = CameraHelper.getDefaultBoundingBox(modelGroup);
        let cameraMatrixWorld        : THREE.Matrix4 = camera.matrixWorld;
        let cameraMatrixWorldInverse : THREE.Matrix4 = camera.matrixWorldInverse;
        
        // Find camera position in View coordinates...
        let boundingBoxView: THREE.Box3 = Graphics.getTransformedBoundingBox(modelGroup, cameraMatrixWorldInverse);

        let verticalFieldOfViewRadians   : number = (camera.fov / 2) * (Math.PI / 180);
        let horizontalFieldOfViewRadians : number = Math.atan(camera.aspect * Math.tan(verticalFieldOfViewRadians));       

        let cameraZVerticalExtents   : number = (boundingBoxView.getSize().y / 2) / Math.tan (verticalFieldOfViewRadians);       
        let cameraZHorizontalExtents : number = (boundingBoxView.getSize().x / 2) / Math.tan (horizontalFieldOfViewRadians);       
        let cameraZ = Math.max(cameraZVerticalExtents, cameraZHorizontalExtents);

        // preserve XY; set Z to include extents
        let cameraPositionView = camera.position.applyMatrix4(cameraMatrixWorldInverse);
        let positionView = new THREE.Vector3(cameraPositionView.x, cameraPositionView.y, boundingBoxView.max.z + cameraZ);
        
        // Now, transform back to World coordinates...
        let positionWorld = positionView.applyMatrix4(cameraMatrixWorld);

        camera.position.copy (positionWorld);
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
     * @param {THREE.Object3D} modelGroup Model to fit.
     * @returns {THREE.PerspectiveCamera} 
     */
    static getStandardViewCamera (view: StandardView, viewAspect : number, modelGroup : THREE.Group) : THREE.PerspectiveCamera { 

        let timerTag = Services.timer.mark('Camera.getStandardView');              
        
        let camera = CameraHelper.getDefaultCamera(viewAspect);               
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
     * @description Resets the clipping planes to the default values.
     */
    static setDefaultClippingPlanes(camera : THREE.PerspectiveCamera) {

        camera.near = Camera.DefaultNearClippingPlane;
        camera.far  = Camera.DefaultFarClippingPlane;
    }

    /**
     * Creates a default scene camera.
     * @param viewAspect View aspect ratio.
     */
    static getDefaultCamera (viewAspect : number) : THREE.PerspectiveCamera {
        
        let defaultCamera = new THREE.PerspectiveCamera();
        defaultCamera.position.copy (new THREE.Vector3 (0, 0, 0));
        defaultCamera.lookAt(new THREE.Vector3(0, 0, -1));
        
        this.setDefaultClippingPlanes(defaultCamera);
        defaultCamera.fov    = Camera.DefaultFieldOfView;
        defaultCamera.aspect = viewAspect;

        // force camera matrix to update; matrixAutoUpdate happens in render loop
        defaultCamera.updateMatrixWorld(true);       
        defaultCamera.updateProjectionMatrix;

        return defaultCamera;
    } 
        
    /**
     * Returns the default scene camera.
     * Creates a default if the current camera has not been constructed.
     * @param camera Active camera (possibly null).
     * @param viewAspect View aspect ratio.
     */
    static getSceneCamera (camera: THREE.PerspectiveCamera, viewAspect : number) : THREE.PerspectiveCamera {

        if (camera)
            return camera;

        let defaultCamera = CameraHelper.getDefaultCamera(viewAspect);
        return defaultCamera;
    } 

    static 
//#endregion 
}
