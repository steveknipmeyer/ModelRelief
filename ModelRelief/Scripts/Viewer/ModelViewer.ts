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

        let ambientLight = new THREE.AmbientLight(0x404040);
        this._scene.add(ambientLight);

        let directionalLight1 = new THREE.DirectionalLight(0xC0C090);
        directionalLight1.position.set(-100, -50, 100);
        this._scene.add(directionalLight1);

        let directionalLight2 = new THREE.DirectionalLight(0xC0C090);
        directionalLight2.position.set(100, 50, -100);
        this._scene.add(directionalLight2);
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

