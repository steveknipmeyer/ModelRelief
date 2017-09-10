// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'

import {ComposerController}                 from "ComposerController"
import {ComposerViewControls}               from "ComposerViewControls"
import {EventType, MREvent, EventManager}   from 'EventManager'
import {Loader}                             from 'Loader'
import {Logger, ConsoleLogger}              from 'Logger'
import {MeshView}                           from "MeshView"
import {MeshViewer}                         from "MeshViewer"
import {ContainerIds}                       from "ModelRelief"
import {ModelView}                          from "ModelView"
import {ModelViewer}                        from "ModelViewer"
import {OBJLoader}                          from "OBJLoader"
import {Services}                           from 'Services'
import {TestModel}                          from 'TestModelLoader'
import {Viewer}                             from "Viewer"
    
export class ComposerView {

    _containerId                : string;
    _meshView                   : MeshView;
    _modelView                  : ModelView;
    _loader                     : Loader;

    _composerController         : ComposerController;
    _composerViewControls       : ComposerViewControls; 
    
    /** Default constructor
     * @class ComposerView
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
     * Gets the ModelView.
     */
    get modelView(): ModelView {

        return this._modelView;
    }

    /**
     * Gets the MeshViewer.
     */
    get meshView(): MeshView {

        return this._meshView;
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

        // Mesh View
        this._meshView = new MeshView(ContainerIds.MeshCanvas);

        // Model View
        this._modelView = new ModelView(ContainerIds.ModelCanvas);

        // Loader
        this._loader = new Loader();

        // OBJ Models
        this._loader.loadOBJModel(this._modelView.modelViewer);

        // Test Models
//      this._loader.loadParametricTestModel(this._modelViewer, TestModel.Checkerboard);

        // View Controller
        this._composerController = new ComposerController(this);

        // View UI Controls
        this._composerViewControls = new ComposerViewControls(this);
    }
    
//#endregion
}

