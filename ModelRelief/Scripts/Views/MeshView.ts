// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'

import { HtmlLibrary, ElementIds }            from 'Html';
import { FileModel }                          from 'FileModel';
import { ILogger, ConsoleLogger }             from 'Logger';
import { MeshViewer }                         from 'MeshViewer';
import { Services }                           from 'Services';
import { Viewer }                             from 'Viewer';

/**
 * @description UI View of a Mesh.
 * @export
 * @class MeshView
 */
export class MeshView {

    _containerId               : string;
    _meshViewer                : MeshViewer;
    
    /**
     * Creates an instance of MeshView.
     * @param {string} containerId 
     * @param {FileModel} model Initial model to load.
     */
    constructor(containerId : string, model : FileModel) {  

        this._containerId = containerId;    
        this.initialize(model);
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
     * @description Gets the ModelViewer.
     * @readonly
     * @type {MeshViewer}
     */
    get meshViewer(): MeshViewer {

        return this._meshViewer;
    }        
//#endregion

//#region Event Handlers
//#endregion

//#region Initialization
    /**
     * @description Performs initialization.
     * @param {FileModel} model Initial model to load.
     */
    initialize(model : FileModel) {

        // Mesh Viewer    
        this._meshViewer = new MeshViewer('MeshViewer', ElementIds.MeshCanvas, model);
    }
    
//#endregion
}

