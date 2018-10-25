// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE from "three";

/**
 * Message Formatting
 * @class
 */
export class Format {
    private static numericPrecision = 2;
    private static numericFieldWidth = 8;
    private static vectorLabelFieldWidth = 8;

    /**
     * @description Formats a Vector2 into fixed width fields.
     * @static
     * @param {string} label Vector label.
     * @param {THREE.Vector2} vector Vector.
     * @param {number} [precision=Format.numericPrecision] Numeric precision.
     * @returns {string}
     */
    public static formatVector2(label: string, vector: THREE.Vector2, precision: number = Format.numericPrecision): string {

        const paddedLabel = Format.padToLength(label, Format.vectorLabelFieldWidth);
        return `${paddedLabel}: ${Format.formatNumber(vector.x)}, ${Format.formatNumber(vector.y)}`;
    }

    /**
     * @description Formats a Vector3 into fixed width fields.
     * @static
     * @param {string} label Vector label.
     * @param {THREE.Vector3} vector Vector.
     * @param {number} [precision=Format.numericPrecision] Numeric precision.
     * @returns {string}
     */
    public static formatVector3(label: string, vector: THREE.Vector3, precision: number = Format.numericPrecision): string {

        const paddedLabel = Format.padToLength(label, Format.vectorLabelFieldWidth);
        return `${paddedLabel}: ${Format.formatNumber(vector.x)}, ${Format.formatNumber(vector.y)}, ${Format.formatNumber(vector.z)}`;
    }

    /**
     * @description Formats a Vector4 into fixed width fields.
     * @static
     * @param {string} label Vector label.
     * @param {THREE.Vector4} vector Vector.
     * @param {number} [precision=Format.numericPrecision] Numeric precision.
     * @returns {string}
     */
    public static formatVector4(label: string, vector: THREE.Vector4, precision: number = Format.numericPrecision): string {

        const paddedLabel = Format.padToLength(label, Format.vectorLabelFieldWidth);
        return `${paddedLabel}: ${Format.formatNumber(vector.x)}, ${Format.formatNumber(vector.y)}, ${Format.formatNumber(vector.z)}, ${Format.formatNumber(vector.w)}`;
    }

    /**
     * @description Left pads a string to a given length.
     * @private
     * @static
     * @param {string} value String to pad.
     * @param {number} length Final length of string.
     * @param {string} [padCharacter=" "] Character to use for left padding.
     * @returns {string}
     */
    public static padToLength(value: string, length: number = Format.numericFieldWidth, padCharacter: string = " "): string {

        const padCount = length - value.length;
        return padCharacter.repeat(padCount) + value;
    }

    /**
     * @description Formats a number to a fixed precision and field width.
     * @private
     * @static
     * @param {number} value Number to format.
     * @param {number} [precision=Format.numericPrecision] Decimal places.
     * @param {number} [width=Format.numericFieldWidth] Field width.
     * @returns {string}
     */
    public static formatNumber(value: number, precision: number = Format.numericPrecision, width: number = Format.numericFieldWidth): string {
        return Format.padToLength(value.toFixed(precision), width);
    }
}
