// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'

import {StandardView}               from "Camera"
import {DepthBufferFactory}         from "DepthBufferFactory"
import {Loader}                     from 'Loader'
import {Logger, ConsoleLogger}      from 'Logger'
import {Graphics}                   from "Graphics"
import {MeshPreviewViewer}          from "MeshPreviewViewer"
import {ModelViewer}                from "ModelViewer"
import {OBJLoader}                  from "OBJLoader"
import {Services}                   from 'Services'
import {TestModel}                  from 'TestModelLoader'
import {Viewer}                     from "Viewer"
    
export class ModelRelief {

    _meshPreviewViewer  : MeshPreviewViewer;
    _modelViewer        : ModelViewer;
    _loader             : Loader;
    
    /** Default constructor
     * @class ModelRelief
     * @constructor
     */
    constructor() {  
    }

    /**
     * Launch the model Viewer.
     */
    run () {

        Services.consoleLogger.addInfoMessage ('ModelRelief started');   
       
        // Mesh Preview
        this._meshPreviewViewer =  new MeshPreviewViewer('meshCanvas');

        // Model Viewer    
        this._modelViewer = new ModelViewer('modelCanvas', this._meshPreviewViewer);

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

