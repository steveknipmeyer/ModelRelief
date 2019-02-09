    // ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

/**
 * Math Library
 * General mathematics routines
 * @class
 */
export class MathLibrary {

    /**
     * Returns whether two numbers are equal within the given tolerance.
     * @param value First value to compare.
     * @param other Second value to compare.
     * @param tolerance Tolerance for comparison.
     * @returns True if within tolerance.
     */
    public static numbersEqualWithinTolerance(value: number, other: number, tolerance: number): boolean {

        return ((value >= (other - tolerance)) && (value <= (other + tolerance)));
    }
    /**
     * @constructor
     */
    constructor() {
    }
}
