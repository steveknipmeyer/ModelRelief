// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                   from 'three'

import {CameraSettings, Camera}     from 'Camera'
import {Graphics}                   from 'Graphics'
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