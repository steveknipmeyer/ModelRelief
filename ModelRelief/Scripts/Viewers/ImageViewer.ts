// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {Graphics} from "Scripts/Graphics/Graphics";
import {IImageModel} from "Scripts/Models/Interfaces/IImageModel";
import {Format} from "Scripts/System/Format";
import {ILogger} from "Scripts/System/Logger";
import {Services} from "Scripts/System/Services";

/**
 * @description Graphics viewer for an image.
 * @export
 * @class ImageViewer
 */
export class ImageViewer  {

    // Public
    public name: string;
    public canvas: HTMLCanvasElement;
    public imageModel: IImageModel;

    // Protected
    protected _logger: ILogger;

    /**
     * Creates an instance of ImageViewer.
     * @param {string} name Viewer name.
     * @param {string} canvasId HTML element to host the viewer.
     * @param {Image} image The image bound to this viewer.
     */
    constructor(name: string, canvasId: string, image: IImageModel) {

        this.name = name;
        this.canvas = document.querySelector(`#${canvasId}`) as HTMLCanvasElement;
        this.imageModel = image;

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
        this._logger.addMessage(`${this.name} Image = ${visible}`);
    }

    /**
     * Handle a mouse down event on the canvas.
     */
    public onMouseDown(event: JQueryEventObject): void {
        // https://www.w3schools.com/colors/colors_names.asp
        const messageStyle = "color:fuchsia";
        const fieldWidth = 4;

        let precision = 2;
        const deviceCoordinates: THREE.Vector2 = Graphics.deviceCoordinatesFromJQEvent(event, $(event.target) as JQuery);
        this._logger.addMessage(`Device = [${Format.formatNumber(deviceCoordinates.x, precision, fieldWidth)}, ${Format.formatNumber(deviceCoordinates.y, precision, fieldWidth)}]`, messageStyle);

        precision = 0;
        const row: number = Math.round((deviceCoordinates.y + 1) / 2 * this.imageModel.height);
        const column: number = Math.round((deviceCoordinates.x + 1) / 2 * this.imageModel.width);
        this._logger.addMessage(`Pixel = [${Format.formatNumber(row, precision, fieldWidth)}, ${Format.formatNumber(column, precision, fieldWidth)}]`, messageStyle);

        this.analyzePixel(row, column);
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
    }

//#endregion

//#region Analysis
    /**
     * @description Analyze a pixel.
     * @param row Image row.
     * @param column Image column.
     */
    public analyzePixel(row: number, column: number) {
    }
//#endregion
}
