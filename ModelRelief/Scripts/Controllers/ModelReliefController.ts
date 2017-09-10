// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'

import {StandardView}                       from "Camera"
import {DepthBufferFactory}                 from "DepthBufferFactory"
import {EventManager, EventType, MREvent}   from 'EventManager'
import {Loader}                             from 'Loader'
import {Logger, ConsoleLogger}              from 'Logger'
import {MeshViewer}                         from "MeshViewer"
import {ModelReliefView}                    from "ModelReliefView"
import {ModelViewer}                        from "ModelViewer"
import {OBJLoader}                          from "OBJLoader"
import {Services}                           from 'Services'
import {Viewer}                             from "Viewer"
    
export class ModelReliefController {  

    _modelReliefView            : ModelReliefView;

    /** Default constructor
     * @class ModelReliefController
     * @param modelReliefView Mesh generation event.
     * @constructor
     */
    constructor(modelReliefView : ModelReliefView) {  

        this._modelReliefView = modelReliefView;
        this.initialize();
    }

//#region Initialization
    /**
     * Initialziation.
     */
    initialize() {

        this._modelReliefView._modelViewer.eventManager.addEventListener(EventType.NewModel, this.onNewModel.bind(this));
    }
//#endregion

//#region Event Handlers
    /**
     * Event handler for mesh generation.
     * @param event Mesh generation event.
     * @param mesh Newly-generated mesh.
     */
    onMeshGenerate (event : MREvent, mesh : THREE.Mesh) {

    }

    /**
     * Event handler for new model.
     * @param event NewModel event.
     * @param model Newly loaded model.
     */
    onNewModel (event : MREvent, model : THREE.Group) {
        
        this._modelReliefView._modelViewer.setCameraToStandardView(StandardView.Front);              
        this._modelReliefView._meshViewer.setCameraToStandardView(StandardView.Top);       
    }
//#endregion
}
