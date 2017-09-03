// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                       from 'three'

import {StandardView}                   from 'Camera'
import {DepthBufferFactory}             from "DepthBufferFactory"
import {EventManager, EventType}        from 'EventManager'
import {Graphics}                       from 'Graphics'
import {Materials}                      from 'Materials'
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

    _modelViewerControls : ModelViewerControls;             // UI controls

    /**
     * Default constructor
     * @class ModelViewer
     * @constructor
     * @param name Viewer name.
     * @param modelCanvasId HTML element to host the viewer.
     */
    constructor(name : string, modelCanvasId : string) {
        
        super (name, modelCanvasId);       
    }

//#region Properties
    /**
     * Sets the model.
     */
    setModel(value : THREE.Group) {

        // Call base class property via super
        // https://github.com/Microsoft/TypeScript/issues/4465        
        super.setModel(value);

        // dispatch NewModel event
        this._eventManager.dispatchEvent(this, EventType.NewModel, value);
    }
                
//#endregion

//#region Initialization    
    /**
     * Populate scene.
     */
    populateScene () {

        super.populateScene(); 
        
        var helper = new THREE.GridHelper(300, 30, 0x86e6ff, 0x999999);
        helper.name = ObjectNames.Grid;
        this._scene.add(helper);
    }

    /**
     * General initialization
     */
    initialize() {
        
        super.initialize();
    }
        
    /**
     * UI controls initialization.
     */
    initializeUIControls() {

        super.initializeUIControls();        
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
    let factory = new DepthBufferFactory({width : width, height : height, model : this.model, camera : this.camera, addCanvasToDOM : false});   

    let previewMesh : THREE.Mesh = factory.meshGenerate({});   
    this._eventManager.dispatchEvent(this, EventType.MeshGenerate, previewMesh);

    // Services.consoleLogger.addInfoMessage('Relief generated');
}
//#endregion
} 

