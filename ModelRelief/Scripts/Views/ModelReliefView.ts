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
import {ContainerIds}                       from "ModelRelief"
import {ModelReliefController}              from "ModelReliefController"
import {ModelReliefViewControls}            from "ModelReliefViewControls"
import {ModelViewer}                        from "ModelViewer"
import {OBJLoader}                          from "OBJLoader"
import {Services}                           from 'Services'
import {TestModel}                          from 'TestModelLoader'
import {Viewer}                             from "Viewer"
    
export class ModelReliefView {

    _containerId                : string;
    _meshViewer                 : MeshViewer;
    _modelViewer                : ModelViewer;
    _loader                     : Loader;

    _modelReliefController      : ModelReliefController;
    _modelReliefViewControls    : ModelReliefViewControls;
    
    /** Default constructor
     * @class ModelRelief
     * @constructor
     */
    constructor(containerId : string) {  

        this._containerId = containerId;    
        this.initialize();
    } 

//#region Properties
    /**
     * Gets the Container Id.
     */
    get containerId(): string {

        return this._containerId;
    }

    /**
     * Gets the ModelViewer.
     */
    get modelViewer(): ModelViewer {

        return this._modelViewer;
    }

    /**
     * Gets the MeshViewer.
     */
    get meshViewer(): MeshViewer {

        return this._meshViewer;
    }
            
    /**
     * Gets the Loader.
     */
    get loader(): Loader {

        return this._loader;
    }
            
//#endregion

//#region Event Handlers
//#endregion

//#region Initialization
    /**
     * Initialziation.
     */
    initialize() {

        Services.consoleLogger.addInfoMessage('ModelRelief started');

        // Mesh Preview
        this._meshViewer = new MeshViewer('MeshViewer', ContainerIds.MeshCanvas);

        // Model Viewer    
        this._modelViewer = new ModelViewer('ModelViewer', ContainerIds.ModelCanvas);

        // Loader
        this._loader = new Loader();

        // OBJ Models
        this._loader.loadOBJModel(this._modelViewer);

        // Test Models
//      this._loader.loadParametricTestModel(this._modelViewer, TestModel.Checkerboard);

        // View Controller
        this._modelReliefController = new ModelReliefController(this);

        // View UI Controls
        this._modelReliefViewControls = new ModelReliefViewControls(this);
    }
    
//#endregion
}

