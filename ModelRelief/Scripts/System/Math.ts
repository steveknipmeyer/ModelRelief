// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";
         
/**
 * Math Library
 * General mathematics routines
 * @class
 */
export class MathLibrary {
    /**
     * @constructor
     */
    constructor() {
    }

    /**
     * Returns whether two numbers are equal within the given tolerance.
     * @param value First value to compare.
     * @param other Second value to compare.
     * @param tolerance Tolerance for comparison.
     * @returns True if within tolerance.
     */
    static numbersEqualWithinTolerance(value : number, other : number, tolerance : number) : boolean {
            
        return ((value >= (other - tolerance)) && (value <= (other + tolerance)));
    }
}
