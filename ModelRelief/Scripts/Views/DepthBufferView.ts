// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three'; 
import * as dat    from 'dat-gui';

import { HtmlLibrary, ElementIds }            from "Html";
import { ILogger, ConsoleLogger }             from 'Logger';
import { Services }                           from 'Services';

/**
 * @description Represents a UI view of a DepthBuffer.
 * @export
 * @class DepthBufferView
 */
export class DepthBufferView {

    static RootContainerId     : string = 'depthBufferView';          // root container for viewer and controls

    _containerId                : string;
    
    /**
     * Creates an instance of DepthBufferView.
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
//#endregion

//#region Event Handlers
//#endregion

//#region Initialization
    /**
     * @description Performs initialization.
     */
    initialize() {
    }
    
//#endregion
}
