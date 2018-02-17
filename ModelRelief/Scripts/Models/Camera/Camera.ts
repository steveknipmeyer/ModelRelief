// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto          from 'DtoModels'
import * as THREE        from 'three'

import { ICamera, StandardView }    from 'ICamera'
import { DepthBufferFactory }       from 'DepthBufferFactory'
import { Graphics }                 from 'Graphics'
import { Model }                    from 'Model';
import { Services }                 from 'Services'
import { StopWatch }                from 'StopWatch'

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
 * Camera
 * @class
 */
export class Camera extends Model<Camera> {

    static DefaultFieldOfView       : number = 37;       // 35mm vertical : https://www.nikonians.org/reviews/fov-tables       
    static DefaultNearClippingPlane : number = 0.1; 
    static DefaultFarClippingPlane  : number = 10000; 
    
    viewCamera : THREE.PerspectiveCamera;

    projectId  : number;

    /**
     * @constructor
     */
    constructor(camera : THREE.PerspectiveCamera) {

        super({
            name: 'Camera', 
            description: 'Perspective Camera',
        });

        this.viewCamera = camera;            
        }

    /**
     * @description Constructs an instance from a DTP model.
     * @returns {Dto.Camera} 
     */
    static fromDtoModel(dtoCamera : Dto.Camera) : Camera {

        let position    = new THREE.Vector3(dtoCamera.positionX, dtoCamera.positionY, dtoCamera.positionZ);
        let quaternion  = new THREE.Quaternion(dtoCamera.eulerX, dtoCamera.eulerY, dtoCamera.eulerZ, dtoCamera.theta);
        let scale       = new THREE.Vector3(dtoCamera.scaleX, dtoCamera.scaleY, dtoCamera.scaleZ);
        let up          = new THREE.Vector3(dtoCamera.upX, dtoCamera.upY, dtoCamera.upZ);

        // construct PerspectiveCamera from DTO properties
        let perspectiveCamera = new THREE.PerspectiveCamera();
        perspectiveCamera.matrix.compose(position, quaternion, scale);
        perspectiveCamera.up.copy(up);

        // set position/rotation/scale attributes
        perspectiveCamera.matrix.decompose(perspectiveCamera.position, perspectiveCamera.quaternion, perspectiveCamera.scale); 

        perspectiveCamera.fov    = dtoCamera.fieldOfView;
        perspectiveCamera.aspect = dtoCamera.aspectRatio;
        perspectiveCamera.near   = dtoCamera.near;
        perspectiveCamera.far    = dtoCamera.far;

        perspectiveCamera.updateProjectionMatrix();

        // constructor
        let camera = new Camera (perspectiveCamera);
        camera.id          = dtoCamera.id;
        camera.name        = dtoCamera.name;
        camera.description = dtoCamera.description;       

        camera.projectId   = dtoCamera.projectId;

        return camera;
    }    

    /**
     * @description Returns a DTO Camera model from the instance.
     * @returns {Dto.Camera} 
     */
    toDtoModel() : Dto.Camera {

        let position    = new THREE.Vector3();
        let quaternion  = new THREE.Quaternion();
        let scale       = new THREE.Vector3();
        let up          = new THREE.Vector3();
        this.viewCamera.matrix.decompose(position, quaternion, scale);
        up = this.viewCamera.up;

        let model = new Dto.Camera({
            id              : this.id,
            name            : this.name,
            description     : this.description,    

            fieldOfView     : this.viewCamera.fov,
            aspectRatio     : this.viewCamera.aspect,
            near            : this.viewCamera.near,
            far             : this.viewCamera.far,

            position        : position,
            quaternion      : quaternion,
            scale           : scale,
            up              : up,

            projectId       : this.projectId
        });

        return model;
    }    
}
