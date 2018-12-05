// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {Graphics} from "Scripts/Graphics/Graphics";
import {NormalMap} from "Scripts/Models/NormalMap/NormalMap";
import {ILogger} from "Scripts/System/Logger";
import {Services} from "Scripts/System/Services";
import {NormalMapViewerControls} from "Scripts/Viewers/NormalMapViewerControls";

/**
 * @description Graphics viewer for a NormalMap.
 * @export
 * @class NormalMapViewer
 */
export class NormalMapViewer  {

    public canvas: HTMLCanvasElement;

    // Private
    private _normalMap: NormalMap;
    private _logger: ILogger;

    private _normalMapViewerControls: NormalMapViewerControls;            // UI controls

    /**
     * Creates an instance of NormalMapViewer.
     * @param {string} name Viewer name.
     * @param {string} canvasId HTML element to host the viewer.
     * @param {NormalMap} normalMap The NormalMap bound to this viewer.
     */
    constructor(name: string, canvasId: string, normalMap: NormalMap) {

        this.canvas = document.querySelector(`#${canvasId}`) as HTMLCanvasElement;
        this._normalMap = normalMap;

        this._logger = Services.defaultLogger;

        this.initialize();
    }

//#region Properties
    /**
     * @description Gets the DOM Id of the Viewer parent container.
     * @readonly
     * @type {string}
     */
    get containerId(): string {

        const parentElement: HTMLElement = this.canvas.parentElement;
        return parentElement.id;
    }
//#endregion

//#region Event Handlers
    /**
     * @description Display the associated NormalMap.
     * @param {boolean} visible
     */
    public displayNormalMap(visible: boolean) {

        this.canvas.style.display = visible ? "" : "none";
        this._logger.addMessage(`Display NormalMap = ${visible}`);
    }

    /**
     * Handle a mouse down event on the canvas.
     */
    public onMouseDown(event: JQueryEventObject): void {
        // https://www.w3schools.com/colors/colors_names.asp
        const messageStyle = "color:fuchsia";

        const deviceCoordinates: THREE.Vector2 = Graphics.deviceCoordinatesFromJQEvent(event, $(event.target) as JQuery);
        this._logger.addMessage(`Device [X, y] = ${deviceCoordinates.x}, ${deviceCoordinates.y}`, messageStyle);

        const decimalPlaces: number = 2;
        const row: number = (deviceCoordinates.y + 1) / 2 * this._normalMap.height;
        const column: number = (deviceCoordinates.x + 1) / 2 * this._normalMap.width;
        this._logger.addMessage(`Offset = [${row}, ${column}]`, messageStyle);

        this._logger.addEmptyLine();
    }

//#endregion

//#region Initialization
    /**
     * @description Initialization.
     */
    public initialize() {
        this.initializeUIControls();

        const $canvas = $(this.canvas).on("mousedown", this.onMouseDown.bind(this));
    }

    /**
     * @description UI controls initialization.
     */
    public initializeUIControls() {

        this._normalMapViewerControls = new NormalMapViewerControls(this);
    }
//#endregion
}
