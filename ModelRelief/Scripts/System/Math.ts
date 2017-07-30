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
export class Math {
    /**
     * @constructor
     */
    constructor() {
    }

    /**
     * Returns whether two numbers are equal within the given tolerance.
     * @param value - First value
     * @param other - Second value
     * @param tolerance - Tolerance for comparison
     * @returns True if within tolerance
     */
    static numbersEqualWithinTolerance(value : number, other : number, tolerance : number) : boolean {
            
        return ((value >= (other - tolerance)) && (value <= (other + tolerance)));
    }

//#endregion
}
