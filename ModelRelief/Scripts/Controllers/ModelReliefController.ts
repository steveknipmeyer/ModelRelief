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
import {ModelRelief}                        from "ModelRelief"
import {ModelViewer}                        from "ModelViewer"
import {OBJLoader}                          from "OBJLoader"
import {Services}                           from 'Services'
import {Viewer}                             from "Viewer"
    
export class ModelReliefController {  

    _modelRelief            : ModelRelief;
    
    _initialMeshGeneration  : boolean = true;

    /** Default constructor
     * @class ModelReliefController
     * @constructor
     */
    constructor(modelRelief : ModelRelief) {  

        this._modelRelief = modelRelief;
        this.initialize();
    }

//#region Initialization
    /**
     * Initialziation.
     */
    initialize() {
        
        this._modelRelief.modelViewer.eventManager.addEventListener(EventType.MeshGenerate, this.onMeshGenerate.bind(this));
        this._modelRelief.modelViewer.eventManager.addEventListener(EventType.NewModel, this.onNewModel.bind(this));
    }
//#endregion

//#region Event Handlers
    /**
     * Event handler for mesh generation.
     * @param event Mesh generation event.
     * @params mesh Newly-generated mesh.
     */
    onMeshGenerate (event : MREvent, mesh : THREE.Mesh) {

        this._modelRelief.meshViewer.setModel(mesh);

        if (this._initialMeshGeneration) {
            this._modelRelief.meshViewer.fitView();
            this._initialMeshGeneration = false;            
        }
    }

    /**
     * Event handler for new model.
     * @param event NewModel event.
     * @param model Newly loaded model.
     */
    onNewModel (event : MREvent, model : THREE.Group) {
        
        this._modelRelief.modelViewer.setCameraToStandardView(StandardView.Front);              
        this._modelRelief.meshViewer.setCameraToStandardView(StandardView.Top);       
    }
//#endregion
}
