// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as dat    from 'dat-gui';

import { DepthBuffer }                from "DepthBuffer";
import { DepthBufferViewer }          from "DepthBufferViewer";
import { HtmlLibrary, ElementIds }    from "Html";

/**
 * @description Represents a UI view of a DepthBuffer.
 * @export
 * @class DepthBufferView
 */
export class DepthBufferView {

    _containerId                : string;
    _depthBufferViewer          : DepthBufferViewer;
    
    /**
     * Creates an instance of DepthBufferView.
     * @param {string} containerId DOM container Id of view.
     * @param {DepthBuffer} depthBuffer The DepthBuffer bound to this view.
     */
    constructor(containerId : string, depthBuffer : DepthBuffer) {  

        this._containerId = containerId;    

        this.initialize(depthBuffer);
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
     * @description Gets the DepthBufferViewer.
     * @readonly
     * @type {DepthBufferViewer}
     */
    get depthBufferViewer(): DepthBufferViewer { 

        return this._depthBufferViewer;
    }        
//#endregion

//#region Event Handlers
//#endregion

//#region Initialization
    /**
     * @description Performs initialization.
     * @param {DepthBuffer} depthBuffer The DepthBuffer bound to this view.
     */
    initialize(depthBuffer : DepthBuffer) {

        // DepthBuffer Viewer    
        this._depthBufferViewer = new DepthBufferViewer('DepthBufferViewer', ElementIds.DepthBufferCanvas, depthBuffer);
    }
    
//#endregion
}
