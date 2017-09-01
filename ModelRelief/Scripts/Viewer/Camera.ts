// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE from 'three'

import {Graphics}             from 'Graphics'

export enum StandardView {
    Front,
    Back,
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
     * @description Updates the camera to fit the model in the current view.
     * @static
     * @param {THREE.PerspectiveCamera} camera Camera to update.
     * @param {THREE.Group} model Model to fit.
     * @returns {CameraSettings} 
     */
    static getFitViewCamera (cameraTemplate : THREE.PerspectiveCamera, model : THREE.Group, ) : THREE.PerspectiveCamera { 

        let camera = cameraTemplate.clone(true);
        let boundingBoxWorld         : THREE.Box3    = Camera.getDefaultBoundingBox(model);
        let cameraMatrixWorld        : THREE.Matrix4 = camera.matrixWorld;
        let cameraMatrixWorldInverse : THREE.Matrix4 = camera.matrixWorldInverse;
        
        // Find camera position in View coordinates...

        // clone model (and geometry!)
        let modelView       =  Graphics.cloneAndTransformObject(model, cameraMatrixWorldInverse);
        let boundingBoxView = Camera.getDefaultBoundingBox(modelView);

        let verticalFieldOfViewRadians   : number = (camera.fov / 2) * (Math.PI / 180);
        let horizontalFieldOfViewRadians : number = Math.atan(camera.aspect * Math.tan(verticalFieldOfViewRadians));       

        let cameraZVerticalExtents   : number = (boundingBoxView.getSize().y / 2) / Math.tan (verticalFieldOfViewRadians);       
        let cameraZHorizontalExtents : number = (boundingBoxView.getSize().x / 2) / Math.tan (horizontalFieldOfViewRadians);       
        let cameraZ = Math.max(cameraZVerticalExtents, cameraZHorizontalExtents);

        let positionView = new THREE.Vector3(boundingBoxView.getCenter().x, boundingBoxView.getCenter().y, boundingBoxView.max.z + cameraZ);

        // Now, transform back to World coordinates...
        let positionWorld = positionView.applyMatrix4(cameraMatrixWorld);

        camera.position.copy (positionWorld);
        camera.lookAt(boundingBoxWorld.getCenter());

        // Is this necessary? The clipping planes and field of view have not been changed.
        camera.updateProjectionMatrix();

        return camera;
    }
        
    /**
     * @description Returns the camera settings to fit the model in a standard view.
     * @static
     * @param {Camera.StandardView} view Standard view (Top, Left, etc.)
     * @param {THREE.Object3D} model Model to fit.
     * @returns {THREE.PerspectiveCamera} 
     */
    static getStandardViewCamera (view: StandardView, viewAspect : number, model : THREE.Group) : THREE.PerspectiveCamera { 
       
        let camera = Camera.getDefaultCamera(viewAspect);               
        switch (view) {

            case StandardView.Front: {
                camera.position.copy (new THREE.Vector3(0,  0, 1));
                camera.up.set(0, 1, 0);
                break;
            }
            case StandardView.Back: {
                camera.position.copy (new THREE.Vector3(0,  0, -1));
                camera.up.set(0, 1, 0);
                break;
            }
            case StandardView.Top: {
                camera.position.copy (new THREE.Vector3(0,  1, 0));
                camera.up.set(0, 0, -1);
                break;
            }
            case StandardView.Bottom: {
                camera.position.copy (new THREE.Vector3(0, -1, 0));
                camera.up.set(0, 0, 1);
                break;
            }
            case StandardView.Left: {
                camera.position.copy (new THREE.Vector3(-1,  0, 0));
                camera.up.set(0, 1, 0);
                break;
            }
            case StandardView.Right: {
                camera.position.copy (new THREE.Vector3(1,  0, 0));
                camera.up.set(0, 1, 0);
                break;
            }
            case StandardView.Isometric: {
                camera.position.copy (new THREE.Vector3(1,  0, 1));
                camera.up.set(-1, 1, -1);
                break;
            }
        }
        camera.updateProjectionMatrix();

        camera = Camera.getFitViewCamera(camera, model);
        return camera;
    }

    /**
     * Creates a default scene camera.
     * @param viewAspect View aspect ratio.
     */
    static getDefaultCamera (viewAspect : number) : THREE.PerspectiveCamera {
        
        let defaultCamera = new THREE.PerspectiveCamera();
        defaultCamera.position.copy (new THREE.Vector3 (0, 0, 1));
        defaultCamera.lookAt(new THREE.Vector3());
        defaultCamera.near   = Camera.DefaultNearClippingPlane;
        defaultCamera.far    = Camera.DefaultFarClippingPlane;
        defaultCamera.fov    = Camera.DefaultFieldOfView;
        defaultCamera.aspect = viewAspect;

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

        let defaultCamera = Camera.getDefaultCamera(viewAspect);
        return defaultCamera;
    }
//#endregion
}
