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
import {EventType, MREvent, EventManager}   from 'EventManager'
import {Loader}                             from 'Loader'
import {Logger, ConsoleLogger}              from 'Logger'
import {Graphics}                           from "Graphics"
import {MeshViewer}                         from "MeshViewer"
import {ModelViewer}                        from "ModelViewer"
import {OBJLoader}                          from "OBJLoader"
import {Services}                           from 'Services'
import {TestModel}                          from 'TestModelLoader'
import {Viewer}                             from "Viewer"
    
export class ModelRelief {

    _meshViewer         : MeshViewer;
    _modelViewer        : ModelViewer;
    _loader             : Loader;
    
    /** Default constructor
     * @class ModelRelief
     * @constructor
     */
    constructor() {  
    }

//#region Event Handlers
    /**
     * Event handler for mesh generation.
     * @param event Mesh generation event.
     * @params mesh Newly-generated mesh.
     */
    onMeshGenerate (event : MREvent, mesh : THREE.Mesh) {

        this._meshViewer.setModel(mesh);
    }

    /**
     * Event handler for new model.
     * @param event NewModel event.
     * @param model Newly loaded model.
     */
    onNewModel (event : MREvent, model : THREE.Group) {
        
        this._modelViewer.setCameraToStandardView(StandardView.Front);              
        this._meshViewer.setCameraToStandardView(StandardView.Front);       
    }
//#endregion

    /**
     * Launch the model Viewer.
     */
    run () {

        Services.consoleLogger.addInfoMessage ('ModelRelief started');   
       
        // Mesh Preview
        this._meshViewer =  new MeshViewer('meshCanvas');
        
        // Model Viewer    
        this._modelViewer = new ModelViewer('modelCanvas');
        this._modelViewer.eventManager.addEventListener(EventType.MeshGenerate, this.onMeshGenerate.bind(this));
        this._modelViewer.eventManager.addEventListener(EventType.NewModel,     this.onNewModel.bind(this));
        
        // Loader
        this._loader = new Loader();

        // OBJ Models
        this._loader.loadOBJModel (this._modelViewer);

        // Test Models
//      this._loader.loadParametricTestModel(this._modelViewer, TestModel.Checkerboard);
    }
}

let modelRelief = new ModelRelief();
modelRelief.run();

