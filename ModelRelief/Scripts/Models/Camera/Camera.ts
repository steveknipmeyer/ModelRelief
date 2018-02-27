// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto          from 'DtoModels'
import * as THREE        from 'three'

import { ICamera, StandardView }        from 'ICamera'
import { DepthBufferFactory }           from 'DepthBufferFactory'
import { Graphics }                     from 'Graphics'
import { HttpLibrary, ServerEndPoints}  from 'Http'
import { IModel }                       from 'IModel'
import { Model }                        from 'Model'
import { Project }                      from 'Project'
import { Services }                     from 'Services'
import { StopWatch }                    from 'StopWatch'

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
 * @description Camera Constructor parameters.
 * @export
 * @interface CameraParameters
 */

/**
 * @description Camera
 * @export
 * @class Camera
 * @extends {Model}
 */
export class Camera extends Model {

    static DefaultFieldOfView       : number =   37;       // 35mm vertical : https://www.nikonians.org/reviews/fov-tables       
    static DefaultNearClippingPlane : number =    0.1; 
    static DefaultFarClippingPlane  : number = 1000; 
    
    viewCamera : THREE.PerspectiveCamera;
    
    // Navigation Properties
    project    : Project;

    /**
     * @constructor
     * Creates an instance of Camera.
     * @param {IModel} parameters IModel properties.
     * @param {THREE.PerspectiveCamera} camera PerspectiveCamera.
     */
    constructor(parameters: IModel, camera : THREE.PerspectiveCamera) {

        parameters.name        = parameters.name        || "Camera"; 
        parameters.description = parameters.description || "Perspective Camera";
        
        super(parameters);

        this.initialize(camera);
    }

    /**
     * @description Perform setup and initialization.
     * @param {THREE.PerspectiveCamera} camera PerspectiveCamera.
     */
    initialize (camera : THREE.PerspectiveCamera) : void {

        this.viewCamera = camera;
    }

    /**
     * @description Returns a Camera instance through an HTTP query of the Id.
     * @static
     * @param {number} id Camera Id.
     * @returns {Promise<Camera>} 
     */
    static async fromIdAsync(id : number ) : Promise<Camera> {

        if (!id)
            return undefined;

        let camera = new Dto.Camera ({
            id : id
        });
        let cameraModel = await camera.getAsync();
        return Camera.fromDtoModelAsync(cameraModel);
    }   
    
    /**
     * @description Constructs an instance from a DTO model.
     * @returns {Camera} 
     */
    static async fromDtoModelAsync(dtoCamera : Dto.Camera) : Promise<Camera> {

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
        let camera = new Camera ({
            id          : dtoCamera.id,
            name        : dtoCamera.name,
            description : dtoCamera.description,       
            },
            perspectiveCamera
        );

        camera.project  = await Project.fromIdAsync(dtoCamera.projectId);

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

        let camera = new Dto.Camera({
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

            projectId       : this.project ? this.project.id : undefined,
        });

        return camera;
    }    
}
