// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                   from 'three'

import {CameraSettings, Graphics}   from 'Graphics'
import {Logger, HTMLLogger}         from 'Logger'
import {MathLibrary}                from 'Math'
import {Services}                   from 'Services'
import {TrackballControls}          from 'TrackballControls'
import {Viewer}                     from 'Viewer'

/**
 * @class
 * MeshViewer
 */
export class MeshPreviewViewer extends Viewer {
    
    /**
     * @constructor
     */
    constructor(previewCanvasId : string) {
        
        super(previewCanvasId);

        //override
        this._logger = Services.htmlLogger;       
    }

//#region Properties
//#endregion

//#region Initialization
    /**
     * Populate scene.
     */
    populateScene () {       
    }

    /**
     * Initializes perspective camera.
     */
    initializeDefaultCameraSettings() : CameraSettings {

        let settings : CameraSettings = {

            position:       new THREE.Vector3(0.0, 0.0, 4.0),
            target:         new THREE.Vector3(0, 0, 0),
            near:           2.0,
            far:            10.0,
            fieldOfView:    37                                  // https://www.nikonians.org/reviews/fov-tables
        };
        
        return settings;
    }

    /**
     * Adds lighting to the scene.
     */
    initializeLighting() {

        let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this._scene.add(ambientLight);

        let directionalLight1 = new THREE.DirectionalLight(0xffffff);
        directionalLight1.position.set(4, 4, 4);
        this._scene.add(directionalLight1);
    }
//#endregion
}