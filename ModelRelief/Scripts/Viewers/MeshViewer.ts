// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                   from 'three';
import * as Dto                     from "DtoModels";

import {Camera}                     from 'Camera';
import {DepthBuffer}                from 'DepthBuffer';
import {FileModel}                  from 'FileModel';
import {Graphics}                   from 'Graphics';
import {StandardView}               from 'ICamera';
import {ILogger, HTMLLogger}        from 'Logger';
import {MathLibrary}                from 'Math';
import {Mesh}                       from 'Mesh';
import {Mesh3d}                     from 'Mesh3d';
import {MeshViewerControls}         from 'MeshViewerControls';
import {Services}                   from 'Services';
import {TrackballControls}          from 'TrackballControls';
import {Viewer}                     from 'Viewer';
  
/**
 * @description Graphics viewer for a Mesh.
 * @export
 * @class MeshViewer
 * @extends {Viewer}
 */
export class MeshViewer extends Viewer {

    mesh : Mesh;                                        // active Mesh

    // Private
    _meshViewerControls: MeshViewerControls;            // UI controls

    /**
     * Creates an instance of MeshViewer.
     * @param {string} name Viewer name.
     * @param {string} previewCanvasId HTML element to host the viewer.
     * @param {FileModel} model Model to load.
     */
    constructor(name : string, previewCanvasId : string, model? : FileModel) {
        
        super(name, previewCanvasId, model);

        this.mesh = model as Mesh;
    }

//#region Properties
//#endregion

//#region Initialization
    /**
     * @description Populate scene.
     */
    populateScene () {       

        let height = 1;
        let width  = 1;
        let mesh = Graphics.createPlaneMesh(new THREE.Vector3(), height, width, new THREE.MeshPhongMaterial(Mesh3d.DefaultMeshPhongMaterialParameters));
        mesh.rotateX(-Math.PI / 2);

        this._root.add(mesh);
    }

    /**
     * @description Adds lighting to the scene.
     */
    initializeLighting() {

        let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);

        let directionalLight1 = new THREE.DirectionalLight(0xffffff);
        directionalLight1.position.set(4, 4, 4);
        this.scene.add(directionalLight1);
    }

    /**
     * @description UI controls initialization.
     */ 
    initializeUIControls() {

        let cameraControlOptions = {
            cameraHelper     : false, 
            fieldOfView      : false, 
            clippingControls : false,
        }
        super.initializeUIControls(cameraControlOptions);
        this._meshViewerControls = new MeshViewerControls(this);
    }   
//#endregion
}