// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three'; 
import * as dat    from 'dat-gui';
import * as Dto    from "DtoModels";

import {HtmlLibrary, ElementIds}            from "Html";
import {ILogger, ConsoleLogger}             from 'Logger';
import {ModelViewer}                        from "ModelViewer";
import {Services}                           from 'Services';
import {Viewer}                             from "Viewer";

/**
 * @description Represents a UI view of a 3D model.
 * @export
 * @class ModelView
 */
export class ModelView {

    _containerId                : string;
    _modelViewer                : ModelViewer;
    
    /**
     * Creates an instance of ModelView.
     * @param {string} containerId DOM container Id of view.
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
     * @description Gets the ModelViewer.
     * @readonly
     * @type {ModelViewer}
     */
    get modelViewer(): ModelViewer { 

        return this._modelViewer;
    }        
//#endregion

//#region Event Handlers
//#endregion

//#region Initialization
    /**
     * @description Performs initialization.
     */
    initialize() {

        // Model Viewer    
        let modelIdElement : HTMLElement = window.document.getElementById('modelId');
        let modelId = parseInt(modelIdElement.textContent);
        let model = new Dto.Model3d({id: modelId});
        
        this._modelViewer = new ModelViewer('ModelViewer', this.containerId, model);
    }
    
//#endregion
}

