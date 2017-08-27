// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                       from 'three'

import {CameraSettings, StandardView}   from 'Camera'
import {DepthBufferFactory}             from "DepthBufferFactory"
import {Graphics}                       from 'Graphics'
import {Materials}                      from 'Materials'
import {MeshPreviewViewer}              from "MeshPreviewViewer"
import {ModelViewerControls}            from "ModelViewerControls"
import {Logger}                         from 'Logger'
import {TrackballControls}              from 'TrackballControls'
import {Services}                       from 'Services'
import {Viewer}                         from 'Viewer'

const ObjectNames = {
    Grid :  'Grid'
}

/**
 * @exports Viewer/ModelViewer
 */
export class ModelViewer extends Viewer {
    
    _meshPreviewViewer : MeshPreviewViewer;                 // associated preview
    _modelViewerControls : ModelViewerControls;             // UI controls

    /**
     * Default constructor
     * @class ModelViewer
     * @constructor
     * @param modelCanvasId HTML element to host the viewer.
     */
    constructor(modelCanvasId : string, meshPreviewViewer : MeshPreviewViewer) {
        
        super (modelCanvasId);

        this._meshPreviewViewer = meshPreviewViewer;
    }

//#region Properties
    /**
     * Gets the camera.
     */
    get camera() {

        return this._camera;
    }

    /**
     * Sets the model.
     */
    setModel(value : THREE.Group) {

        // Call base class property via super
        // https://github.com/Microsoft/TypeScript/issues/4465        
        super.setModel(value);

        this._modelViewerControls.synchronizeCameraSettings(this.camera);
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
     * General initialization
     */
    initialize() {
        
        super.initialize();

        this.initializeUIControls();
    }
        
    /**
     * UI controls initialization.
     */
    initializeUIControls() {

        this._modelViewerControls = new ModelViewerControls(this);
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

//#region Mesh Generation
    /**
     * Generates a relief from the current model camera.
     */
    generateRelief() : void { 
        
    // pixels
    let width  = 512;
    let height = width / this.aspectRatio;
    let factory = new DepthBufferFactory({width : width, height : height, model : this.model, camera : this.camera, addCanvasToDOM : true});   

    // WIP: trigger an event that can be consumed by the MeshPreviewViewer?
    let previewMesh : THREE.Mesh = factory.meshGenerate({});
    this._meshPreviewViewer.setModel(previewMesh);
        
    Services.consoleLogger.addInfoMessage('Relief generated');
}
//#endregion
} 

