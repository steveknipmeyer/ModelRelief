// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE from 'three'
          
/**
 * Camera
 * General camera utility methods.
 * @class
 */
export class Camera {

    /**
     * @constructor
     */
    constructor() {
    }

//#region Clipping Planes
    static optimizeClippingPlanes (camera : THREE.PerspectiveCamera, model : THREE.Group) {
        
        let modelClone : THREE.Group = model.clone(true);
        modelClone.applyMatrix(camera.matrixWorldInverse);
        
        model = modelClone;
    }

//#endregion
}
