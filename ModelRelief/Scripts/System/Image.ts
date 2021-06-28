// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";
import * as THREE from "three";

import {assert} from "chai";

/**
 * @description Image formats.
 * @export
 * @enum {number}
 */
export enum ImageFormat {
    Unknown = 0,
    RGB = 1,
    RGBA = 2,
    Float = 3,
}

/**
 * Image
 * Generic image.
 * @class
 */
export class Image {
    // Constants
    public static RGBASize: number = 4;             // bytes per RGBA pixel
    public static RGBSize: number = 3;              // bytes per RGB pixel
    public static FloatSize: number = 4;            // bytes per float pixel

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

//#region Properties
    /**
     * @description Returns the number of elements in the image.
     * @type {number}
     */
    get length(): number {

        return this.data.length / Image.RGBASize;
    }

//#endregion

    /**
     * Constructs a Hex RGBA string of a pixel.
     * @param row Pixel row.
     * @param column Column row.
     */
    public HexRGBA(row: number, column: number): string {

        const offset = (row * this.width) + column;
        const rValue = this.data[offset + 0].toString(16);
        const gValue = this.data[offset + 1].toString(16);
        const bValue = this.data[offset + 2].toString(16);
        const aValue = this.data[offset + 3].toString(16);

        return `#${rValue}${gValue}${bValue} ${aValue}`;
    }

    /**
     * @description Returns the buffer indices of a model point in world coordinates.
     * @param {THREE.Vector3} worldVertex Vertex of model.
     * @param {THREE.Box3} planeBoundingBox Size of planar bounding box.
     * @returns {THREE.Vector2}
     */
    public getModelVertexIndices(worldVertex: THREE.Vector3, planeBoundingBox: THREE.Box3): THREE.Vector2 {

        const boxSize: THREE.Vector3 = planeBoundingBox.getSize(new THREE.Vector3());
        const meshExtents: THREE.Vector2 = new THREE.Vector2 (boxSize.x, boxSize.y);

        //  map coordinates to offsets in range [0, 1]
        const offsetX: number = (worldVertex.x + (boxSize.x / 2)) / boxSize.x;
        const offsetY: number = (worldVertex.y + (boxSize.y / 2)) / boxSize.y;

        let row: number = offsetY * (this.height - 1);
        let column: number = offsetX * (this.width - 1);
        row    = Math.round(row);
        column = Math.round(column);

        assert.isTrue((row >= 0) && (row < this.height), (`Vertex (${worldVertex.x}, ${worldVertex.y}, ${worldVertex.z}) yielded row = ${row}`));
        assert.isTrue((column >= 0) && (column < this.width), (`Vertex (${worldVertex.x}, ${worldVertex.y}, ${worldVertex.z}) yielded column = ${column}`));

        return new THREE.Vector2(row, column);
    }

    /**
     * @description Returns the linear index of a model point in world coordinates.
     * @param {THREE.Vector3} worldVertex Vertex of model.
     * @param {THREE.Box3} planeBoundingBox Size of planar bounding box.
     * @returns {number}
     */
    public getModelVertexIndex(worldVertex: THREE.Vector3, planeBoundingBox: THREE.Box3): number {

        const indices: THREE.Vector2 = this.getModelVertexIndices(worldVertex, planeBoundingBox);
        const row: number = indices.x;
        const column: number = indices.y;

        let index = (row * this.width) + column;
        index = Math.round(index);

        assert.isTrue((index >= 0) && (index < this.length), (`Vertex (${worldVertex.x}, ${worldVertex.y}, ${worldVertex.z}) yielded index = ${index}`));

        return index;
    }
}
