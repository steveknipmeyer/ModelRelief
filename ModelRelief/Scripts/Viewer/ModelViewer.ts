// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                       from 'three'

import {CameraSettings, StandardView}   from 'Camera'
import {TrackballControls}              from 'TrackballControls'
import {Graphics}                       from 'Graphics'
import {Logger}                         from 'Logger'
import {Materials}                      from 'Materials'
import {Services}                       from 'Services'
import {Viewer}                         from 'Viewer'

const ObjectNames = {
    Grid :  'Grid'
}

/**
 * @exports Viewer/ModelViewer
 */
export class ModelViewer extends Viewer {

    /**
     * Default constructor
     * @class ModelViewer
     * @constructor
     * @param modelCanvasId HTML element to host the viewer.
     */
    constructor(modelCanvasId : string) {
        
        super (modelCanvasId);
    }

//#region Properties
    /**
     * Gets the camera.
     */
    get camera() {

        return this._camera;
    }
        
//#endregion

//#region Initialization    
    /**
     * Populate scene.
     */
    populateScene () {
        
        var helper = new THREE.GridHelper(300, 30, 0x86e6ff, 0x999999);
        helper.name = ObjectNames.Grid;
        this._scene.add(helper);
    }

    /**
     * Adds lighting to the scene
     */
    initializeLighting() {

        super.initializeLighting();
    }   
//#endregion

//#region Scene
    /**
     * Display the reference grid.
     */
    displayGrid(visible : boolean) {

        let gridGeometry : THREE.Object3D = this._scene.getObjectByName(ObjectNames.Grid);
        gridGeometry.visible = visible;
        this._logger.addInfoMessage(`Display grid = ${visible}`);
    } 
//#endregion

} 

