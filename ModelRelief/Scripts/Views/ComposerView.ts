// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'
import * as Dto    from "DtoModels";

import {ComposerController}                 from "ComposerController"
import {EventType, MREvent, EventManager}   from 'EventManager'
import {HtmlLibrary, ElementIds}            from "Html"
import {Loader}                             from 'Loader'
import {ILogger, ConsoleLogger}             from 'Logger'
import {MeshView}                           from "MeshView"
import {MeshViewer}                         from "MeshViewer"
import {ModelView}                          from "ModelView"
import {ModelViewer}                        from "ModelViewer"
import {OBJLoader}                          from "OBJLoader"
import {Services}                           from 'Services'
import {TestModel}                          from 'TestModelLoader'
import {Viewer}                             from "Viewer"

/**
 * @description Represents the UI view used to compose a relief.
 * @export
 * @class ComposerView
 */
export class ComposerView {

    _containerId                : string;
    _meshView                   : MeshView;
    _modelView                  : ModelView;
    _loader                     : Loader;

    _composerController         : ComposerController;
    
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
     * @description Gets the Container Id.
     * @readonly
     * @type {string}
     */
    get containerId(): string {

        return this._containerId;
    }

    /**
     * @description Gets the ModelView.
     * @readonly
     * @type {string}
     */
    get modelView(): ModelView {

        return this._modelView;
    }

    /**
     * @description Gets the MeshViewer.
     * @readonly
     * @type {string}
     */
    get meshView(): MeshView {

        return this._meshView;
    }
            
    /**
     * @description Gets the Loader.
     * @readonly
     * @type {string}
     */
    get loader(): Loader {

        return this._loader;
    }          
//#endregion

//#region Event Handlers
//#endregion

//#region Initialization
    /**
     * @description Performs initialization.
     */
    async initialize() {

        Services.defaultLogger.addInfoMessage('ModelRelief started');

        // Mesh View
        this._meshView = new MeshView(ElementIds.MeshCanvas);

        // Model View
        this._modelView = new ModelView(ElementIds.ModelCanvas); 

        // Composer Controller 
        this._composerController = new ComposerController(this);

        // Loader (model event handlers now initialized)
        this._modelView.modelViewer.loadModel();

        // Test Models
//      this._loader.loadParametricTestModel(this._modelViewer, TestModel.Checkerboard);
    }
    
//#endregion
}
