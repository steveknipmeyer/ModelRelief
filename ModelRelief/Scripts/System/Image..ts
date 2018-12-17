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
 * Image Library
 * General image processing support.
 * @class
 */
export class ImageLibrary {

    // Public
    public width: number;
    public height: number;

    /**
     * @constructor
     */
    constructor() {
    }

    /**
     * Constructs an RGBA string with the byte values of a pixel.
     * @param buffer Unsigned byte raw buffer.
     * @param row Pixel row.
     * @param column Column row.
     */
     protected unsignedBytesToRGBA(buffer: Uint8Array, row: number, column: number): string {

        const offset = (row * this.width) + column;
        const rValue = buffer[offset + 0].toString(16);
        const gValue = buffer[offset + 1].toString(16);
        const bValue = buffer[offset + 2].toString(16);
        const aValue = buffer[offset + 3].toString(16);

        return `#${rValue}${gValue}${bValue} ${aValue}`;
    }
}
