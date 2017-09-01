// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                   from 'three'

import {Camera, StandardView}       from 'Camera'
import {DepthBuffer}                from 'DepthBuffer'
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
export class MeshViewer extends Viewer {
    
    /**
     * @constructor
     * @constructor
     */

    /**
     * Default constructor
     * @class MeshViewer
     * @constructor
     * @param name Viewer name.
     * @param previewCanvasId HTML element to host the viewer.
     */
    constructor(name : string, previewCanvasId : string) {
        
        super(name, previewCanvasId);

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

        let height = 1;
        let width  = 1;
        let mesh = Graphics.createPlaneMesh(new THREE.Vector3(), height, width, new THREE.MeshPhongMaterial(DepthBuffer.DefaultMeshPhongMaterialParameters));
        mesh.rotateX(-Math.PI / 2);

        this._root.add(mesh);
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