// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";
         
/// <summary>
/// Math Library
/// General mathematics routines
/// </summary>
export class Math {
    /// <summary>
    ///  Constructor
    /// </summary>
    constructor() {
    }

    /// <summary>
    ///  Returns whether two numbers are equal within the given tolerance.
    /// </summary>
    static numbersEqualWithinTolerance(value : number, other : number, tolerance : number) : boolean {
            
        return ((value >= (other - tolerance)) && (value <= (other + tolerance)));
    }

//#endregion
}
