// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'

import {EventType, MREvent, EventManager}   from 'EventManager'
import {Loader}                             from 'Loader'
import {Logger, ConsoleLogger}              from 'Logger'
import {MeshViewer}                         from "MeshViewer"
import {ModelReliefController}              from "ModelReliefController"
import {ModelViewer}                        from "ModelViewer"
 import {OBJLoader}                          from "OBJLoader"
import {Services}                           from 'Services'
import {TestModel}                          from 'TestModelLoader'
import {Viewer}                             from "Viewer"
    
export class ModelRelief {

    meshViewer             : MeshViewer;
    modelViewer            : ModelViewer;
    loader                 : Loader;

    _modelReliefController : ModelReliefController;

    /** Default constructor
     * @class ModelRelief
     * @constructor
     */
    constructor() {  

        this.initialize();
    }

//#region Event Handlers
//#endregion

//#region Initialization
    /**
     * Initialziation.
     */
    initialize() {

        Services.consoleLogger.addInfoMessage('ModelRelief started');

        // Mesh Preview
        this.meshViewer = new MeshViewer('MeshViewer', 'meshCanvas');

        // Model Viewer    
        this.modelViewer = new ModelViewer('ModelViewer', 'modelCanvas');

        // Loader
        this.loader = new Loader();

        // OBJ Models
        this.loader.loadOBJModel(this.modelViewer);

        // Test Models
//      this._loader.loadParametricTestModel(this._modelViewer, TestModel.Checkerboard);

        // View Controller
        this._modelReliefController = new ModelReliefController(this);
    }
    
//#endregion
}

let modelRelief = new ModelRelief();
