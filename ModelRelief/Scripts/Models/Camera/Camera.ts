// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto          from 'DtoModels'
import * as THREE        from 'three'

import { ICamera }            from 'ICamera'
import { DepthBufferFactory } from 'DepthBufferFactory'
import { Graphics }           from 'Graphics'
import { Model }              from 'Model';
import { Services }           from 'Services'
import { StopWatch }          from 'StopWatch'

/**
 * @description Caamera settings.
 * @export
 * @interface CameraSettings
 */
export interface CameraSettings {

    position        : THREE.Vector3;        // location of camera
    target          : THREE.Vector3;        // target point
    near            : number;               // near clipping plane
    far             : number;               // far clipping plane
    fieldOfView     : number;               // field of view
    
    standardView    : StandardView;   
}

export enum StandardView {
    None,
    Front,
    Back,
    Top,
    Bottom,
    Left,
    Right,
    Isometric
}
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

    boundClippingPlanes : boolean = true; 
    projectId           : number  = 0;

    /**
     * @constructor
     */
    constructor(camera : THREE.PerspectiveCamera) {

        super({
            name: 'Camera', 
            description: 'Perspective Camera',
        });

        this.viewCamera = camera.clone(true);            
    }
    
    /**
     * @description Constructs an instance from a DTP model.
     * @returns {Dto.Camera} 
     */
    static fromDtoModel(dtoCamera : Dto.Camera) : Camera {

        let perspectiveCamera = new THREE.PerspectiveCamera();
        
        perspectiveCamera.position.set(dtoCamera.positionX, dtoCamera.positionY, dtoCamera.positionZ);
        perspectiveCamera.fov   = dtoCamera.fieldOfView;
        perspectiveCamera.near  = dtoCamera.near;
        perspectiveCamera.far   = dtoCamera.far;
        
        let lookAt = new THREE.Vector3(dtoCamera.lookAtX, dtoCamera.lookAtY, dtoCamera.lookAtZ);
        let lookAtNormalized = lookAt.normalize();
        perspectiveCamera.lookAt(lookAtNormalized);

        let camera = new Camera (perspectiveCamera);
        camera.id          = dtoCamera.id;
        camera.name        = dtoCamera.name;
        camera.description = dtoCamera.description;
        
        camera.boundClippingPlanes = dtoCamera.boundClippingPlanes;
        camera.projectId           = dtoCamera.projectId;

        return camera;
    }    

    /**
     * @description Returns a DTO Camera model from the instance.
     * @returns {Dto.Camera} 
     */
    toDtoModel() : Dto.Camera {

        let lookAt: THREE.Vector3 = this.viewCamera.getWorldDirection();

        let model = new Dto.Camera({
            id              : this.id,
            name            : this.name,
            description     : this.description,    

            standardView    : StandardView.None,
            fieldOfView     : this.viewCamera.fov,

            near            : this.viewCamera.near,
            far             : this.viewCamera.far,

            boundClippingPlanes : this.boundClippingPlanes,

            position        : this.viewCamera.position,
            lookAt          : lookAt,

            projectId       : this.projectId
        });

        return model;
    }    
}
