// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                       from 'three'

import {DepthBufferFactory}             from "DepthBufferFactory"
import {EventManager, EventType}        from 'EventManager'
import {Graphics}                       from 'Graphics'
import {StandardView}                   from "ICamera"
import {Materials}                      from 'Materials'
import {ModelViewerControls}            from "ModelViewerControls"
import {ILogger}                        from 'Logger'
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
        this.eventManager.dispatchEvent(this, EventType.NewModel, value);
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
        this.scene.add(helper);
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

        let gridGeometry : THREE.Object3D = this.scene.getObjectByName(ObjectNames.Grid);
        gridGeometry.visible = visible;
        this._logger.addInfoMessage(`Display grid = ${visible}`);
    } 
//#endregion
} 

