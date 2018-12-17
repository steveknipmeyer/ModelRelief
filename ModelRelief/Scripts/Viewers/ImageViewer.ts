// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {Graphics} from "Scripts/Graphics/Graphics";
import {ILogger} from "Scripts/System/Logger";
import {Services} from "Scripts/System/Services";

export interface Image {

    width: number;
    height: number;
}

export interface ImageViewerControls {

}

/**
 * @description Graphics viewer for an image.
 * @export
 * @class ImageViewer
 */
export class ImageViewer  {

    // Public
    public name: string;
    public canvas: HTMLCanvasElement;

    // Protected
    protected _imageViewerControls: ImageViewerControls;            // UI controls

    // Private
    private _image: Image;
    private _logger: ILogger;

    /**
     * Creates an instance of ImageViewer.
     * @param {string} name Viewer name.
     * @param {string} canvasId HTML element to host the viewer.
     * @param {Image} image The image bound to this viewer.
     */
    constructor(name: string, canvasId: string, image: Image) {

        this.canvas = document.querySelector(`#${canvasId}`) as HTMLCanvasElement;
        this._image = image;

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
     * @description Display the associated image.
     * @param {boolean} visible
     */
    public displayImage(visible: boolean): void {

        this.canvas.style.display = visible ? "" : "none";
        this._logger.addMessage(`Display Image = ${visible}`);
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
        const row: number = (deviceCoordinates.y + 1) / 2 * this._image.height;
        const column: number = (deviceCoordinates.x + 1) / 2 * this._image.width;
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

//      this._imageViewerControls = new NormalMapViewerControls(this);
    }
//#endregion
}
