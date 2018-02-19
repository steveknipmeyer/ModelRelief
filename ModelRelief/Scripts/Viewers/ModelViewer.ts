// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                       from 'three';

import {DepthBufferFactory}             from "DepthBufferFactory";
import {EventManager, EventType}        from 'EventManager';
import {Graphics}                       from 'Graphics';
import {StandardView}                   from "ICamera";
import {IFileModel}                     from 'IFileModel';
import {ILogger}                        from 'Logger';
import {Materials}                      from 'Materials';
import {ModelViewerControls}            from "ModelViewerControls";
import {TrackballControls}              from 'TrackballControls';
import {Services}                       from 'Services';
import {Viewer}                         from 'Viewer';

const ObjectNames = {
    Grid :  'Grid'
}

/**
 * @description Represents a graphic viewer for a 3D model.
 * @export
 * @class ModelViewer
 * @extends {Viewer}
 */
export class ModelViewer extends Viewer {

    _modelViewerControls : ModelViewerControls;             // UI controls

    /**
     * Creates an instance of ModelViewer.
     * @param {string} name Viewer name.
     * @param {string} modelCanvasId HTML element to host the viewer.
     * @param {IFileModel} model Model to load.
     */
    constructor(name : string, modelCanvasId : string, model : IFileModel) {
        
        super (name, modelCanvasId, model);       
    }

//#region Properties
    /**
     * @description Sets the graphics of the model viewer..
     * @param {THREE.Group} modelGroup Graphics group to set.
     */
    setModelGroup(modelGroup : THREE.Group) {

        // Call base class property via super
        // https://github.com/Microsoft/TypeScript/issues/4465        
        super.setModelGroup(modelGroup);

        // dispatch NewModel event
        this.eventManager.dispatchEvent(this, EventType.NewModel, modelGroup);
    }
//#endregion

//#region Initialization    
    /**
     * @description Populate scene.
     */
    populateScene () {

        super.populateScene(); 
        
        var helper = new THREE.GridHelper(300, 30, 0x86e6ff, 0x999999);
        helper.name = ObjectNames.Grid;
        this.scene.add(helper);
    }

    /**
     * @description General initialization.
     */
    initialize() {
        
        super.initialize();
    }
        
    /**
     * @description UI controls initialization.
     */
    initializeUIControls() {

        super.initializeUIControls();        
        this._modelViewerControls = new ModelViewerControls(this);
    }
//#endregion

//#region Scene
    /**
     * @description Display the reference grid.
     * @param {boolean} visible 
     */
    displayGrid(visible : boolean) {

        let gridGeometry : THREE.Object3D = this.scene.getObjectByName(ObjectNames.Grid);
        gridGeometry.visible = visible;
        this._logger.addInfoMessage(`Display grid = ${visible}`);
    } 
//#endregion
} 

