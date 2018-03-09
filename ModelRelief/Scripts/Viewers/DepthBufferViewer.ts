// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { DepthBuffer }               from "DepthBuffer";
import { DepthBufferViewerControls } from 'DepthBufferViewerControls';
import { Graphics}                   from 'Graphics'
import { ILogger }                   from 'Logger';
import { Services }                  from 'Services';
  
/**
 * @description Graphics viewer for a DepthBuffer.
 * @export
 * @class DepthBufferViewer
  */
export class DepthBufferViewer  {

    canvas : HTMLCanvasElement;

    // Private
    _depthBuffer    : DepthBuffer;
    _logger         : ILogger;

    // Private
    _depthBufferViewerControls: DepthBufferViewerControls;            // UI controls

    /**
     * Creates an instance of DepthBufferViewer.
     * @param {string} name Viewer name.
     * @param {string} canvasId HTML element to host the viewer.
     * @param {DepthBuffer} depthBuffer The DepthBuffer bound to this viewer.
     */
    constructor(name : string, canvasId : string, depthBuffer : DepthBuffer) {

        this.canvas = <HTMLCanvasElement> document.querySelector(`#${canvasId}`);
        this._depthBuffer = depthBuffer;    

        this._logger = Services.defaultLogger;

        this.initialize();
    }

//#region Properties
    /**
     * @description Gets the DOM Id of the Viewer parent container.
     * @readonly
     * @type {string}
     */
    get containerId() : string {
        
        let parentElement : HTMLElement = this.canvas.parentElement;
        return parentElement.id;
    } 
//#endregion

//#region Event Handlers
    /**
     * @description Display the associated DepthBuffer.
     * @param {boolean} visible 
     */
    displayDepthBuffer(visible : boolean) {

        this.canvas.style.display = visible ? '' : 'none';
        this._logger.addMessage(`Display DepthBuffer = ${visible}`);
    } 

    /**
     * Handle a mouse down event on the canvas.
     */
    onMouseDown(event : JQueryEventObject) : void {
        // https://www.w3schools.com/colors/colors_names.asp
        let messageStyle = 'color:fuchsia'

        let deviceCoordinates : THREE.Vector2 = Graphics.deviceCoordinatesFromJQEvent(event, $(event.target));
        this._logger.addMessage(`Device = ${deviceCoordinates.x}, ${deviceCoordinates.y}`, messageStyle);
        
        let decimalPlaces   : number = 2;
        let row             : number = (deviceCoordinates.y + 1) / 2 * this._depthBuffer.height;
        let column          : number = (deviceCoordinates.x + 1) / 2 * this._depthBuffer.width;
        this._logger.addMessage(`Offset = [${row}, ${column}]`, messageStyle);       
        this._logger.addMessage(`Depth = ${this._depthBuffer.depth(row, column).toFixed(decimalPlaces)}`, messageStyle);       
        this._logger.addEmptyLine();
    }

//#endregion

//#region Initialization
    /**
     * @description Initialization.
     */
    initialize() {
        this.initializeUIControls();            

        let $canvas = $(this.canvas).on('mousedown', this.onMouseDown.bind(this));
    }

    /**
     * @description UI controls initialization.
     */ 
    initializeUIControls() {

        this._depthBufferViewerControls = new DepthBufferViewerControls(this);
    }   
//#endregion
}