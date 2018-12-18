// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

/**
 * @description Image formats.
 * @export
 * @enum {number}
 */
export enum ImageFormat {
}

/**
 * Image
 * Generic image.
 * @class
 */
export class Image {
    // Constants
    public static RGBASize: number = 4;         // bytes per RGBA pixel

    // Public
    public width: number;                       // width of image
    public height: number;                      // height of image
    public data: Uint8Array;                    // raw bytes

    /**
     * @constructor
     */
    constructor(width: number, height: number, data: Uint8Array) {

        this.width = width;
        this.height = height;
        this.data = data;
    }

    /**
     * Constructs a Hex RGBA string of a pixel.
     * @param row Pixel row.
     * @param column Column row.
     */
     protected HexRGBA(row: number, column: number): string {

        const offset = (row * this.width) + column;
        const rValue = this.data[offset + 0].toString(16);
        const gValue = this.data[offset + 1].toString(16);
        const bValue = this.data[offset + 2].toString(16);
        const aValue = this.data[offset + 3].toString(16);

        return `#${rValue}${gValue}${bValue} ${aValue}`;
    }
}
