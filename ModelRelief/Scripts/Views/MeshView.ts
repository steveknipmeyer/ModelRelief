// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'

import {HtmlLibrary, ElementIds}            from "Html"
import {ILogger, ConsoleLogger}              from 'Logger'
import {MeshViewer}                         from "MeshViewer"
import {Services}                           from 'Services'
import {Viewer}                             from "Viewer"
    
export class MeshView {

    _containerId               : string;
    _meshViewer                : MeshViewer;
    
    /** Default constructor
     * @class MeshView
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
    get meshViewer(): MeshViewer {

        return this._meshViewer;
    }        
//#endregion

//#region Event Handlers
//#endregion

//#region Initialization
    /**
     * Initialziation.
     */
    initialize() {

        // Mesh Viewer    
        this._meshViewer = new MeshViewer('ModelViewer', this.containerId);
    }
    
//#endregion
}

