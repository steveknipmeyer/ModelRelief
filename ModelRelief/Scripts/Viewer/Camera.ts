// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE from 'three'

import {Graphics}             from 'Graphics'

export interface CameraSettings {
    position:       THREE.Vector3;        // location of camera
    target:         THREE.Vector3;        // target point
    near:           number;               // near clipping plane
    far:            number;               // far clipping plane
    fieldOfView:    number;               // field of view
}

export enum StandardView {
    Front,
    Top,
    Bottom,
    Left,
    Right,
    Isometric
}

/**
 * Camera
 * General camera utility methods.
 * @class
 */
export class Camera {

    static DefaultFieldOfView       : number = 37;       // 35mm vertical : https://www.nikonians.org/reviews/fov-tables       
    static DefaultNearClippingPlane : number = 0.1; 
    static DefaultFarClippingPlane  : number = 10000; 
    
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
     * @description Returns the camera settings to fit the model in the current view.
     * @static
     * @param {THREE.Group} model Model to fit.
     * @param {number} viewAspect Aspect ratio of view.
     * @returns {CameraSettings} 
     */
    static getFitViewSettings (model : THREE.Group, camera : THREE.PerspectiveCamera) : CameraSettings { 

        let boundingBoxWorld         : THREE.Box3    = Camera.getDefaultBoundingBox(model);
        let cameraMatrixWorld        : THREE.Matrix4 = camera.matrixWorld;
        let cameraMatrixWorldInverse : THREE.Matrix4 = camera.matrixWorldInverse;
        
        // Find camera position in View coordinates...

        // clone model (and geometry!)
        let modelView       =  Graphics.cloneAndTransformObject(model, cameraMatrixWorldInverse);
        let boundingBoxView = Camera.getDefaultBoundingBox(modelView);

        let verticalFieldOfViewRadians   : number = (Camera.DefaultFieldOfView / 2) * (Math.PI / 180);
        let horizontalFieldOfViewRadians : number = Math.atan(camera.aspect * Math.tan(verticalFieldOfViewRadians));       

        let cameraZVerticalExtents   : number = (boundingBoxView.getSize().y / 2) / Math.tan (verticalFieldOfViewRadians);       
        let cameraZHorizontalExtents : number = (boundingBoxView.getSize().x / 2) / Math.tan (horizontalFieldOfViewRadians);       
        let cameraZ = Math.max(cameraZVerticalExtents, cameraZHorizontalExtents);

        // find distance from cameraZ to boundingBox.center
        // find distance from current camera to boundingBox.center
        // find offset
        // find unit vector from camera to target
        // translate camera by offset along unit vector

        let positionView = new THREE.Vector3(boundingBoxView.getCenter().x, boundingBoxView.getCenter().y, boundingBoxView.max.z + cameraZ);       

        // Now, transform back to World coordinates...
        let positionWorld = positionView.applyMatrix4(cameraMatrixWorld);

        let cameraSettings : CameraSettings = {
            position:       positionWorld,
            target:         boundingBoxWorld.getCenter(),
            near:           Camera.DefaultNearClippingPlane,
            far:            Camera.DefaultFarClippingPlane,
            fieldOfView:    Camera.DefaultFieldOfView             
        };
        return cameraSettings;
    }
        
    /**
     * @description Returns the camera settings to fit the model in a standard view.
     * @static
     * @param {Camera.StandardView} view Standard view (Top, Left, etc.)
     * @param {THREE.Object3D} model Model to fit.
     * @param {number} viewAspect Aspect ratio of view.
     * @returns {CameraSettings} 
     */
    static getStandardViewSettings (view: StandardView, model : THREE.Group, camera : THREE.PerspectiveCamera) : CameraSettings { 
        
        let cameraSettings = Camera.getFitViewSettings(model, camera);
        return cameraSettings;
    }

    /**
     * Returns the default camera.
     * Creates a default if the current camera has not been constructed.
     * @param camera Active camera.
     * @param viewAspect View aspect ratio.
     */
    static getDefaultCamera (camera: THREE.PerspectiveCamera, viewAspect : number) : THREE.PerspectiveCamera {

        if (camera)
            return camera;

        let proxyCamera = new THREE.PerspectiveCamera();
        proxyCamera.position.copy (new THREE.Vector3 (0, 0, 1));
        proxyCamera.lookAt(new THREE.Vector3);
        proxyCamera.near   = Camera.DefaultNearClippingPlane;
        proxyCamera.far    = Camera.DefaultFarClippingPlane;
        proxyCamera.fov    = Camera.DefaultFieldOfView;
        proxyCamera.aspect = viewAspect;

        proxyCamera.updateProjectionMatrix;

        return proxyCamera;
    }
//#endregion
}
