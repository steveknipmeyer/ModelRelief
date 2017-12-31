// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'

import {HtmlLibrary, ElementIds}            from "Html"
import {Logger, ConsoleLogger}              from 'Logger'
import {ModelViewer}                        from "ModelViewer"
import {Services}                           from 'Services'
import {Viewer}                             from "Viewer"
    
export class ModelView {

    _containerId                : string;
    _modelViewer                : ModelViewer;
    
    /** Default constructor
     * @class ModelView
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
//#endregion

//#region Event Handlers
//#endregion

//#region Initialization
    /**
     * Initialziation.
     */
    initialize() {

        // Model Viewer    
        this._modelViewer = new ModelViewer('ModelViewer', this.containerId);
    }
    
//#endregion
}

