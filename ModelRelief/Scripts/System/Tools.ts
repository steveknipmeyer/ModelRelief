// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

/**
 * Tool Library
 * General utility routines
 * @class
 */
export class Tools {

//#region Utility
    /// <summary>
    // Generate a pseudo GUID.
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    /// </summary>
    public static generatePseudoGUID() {

        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
        }

        return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
                s4() + "-" + s4() + s4() + s4();
    }

    /**
     * @description Utility method to sleep for a given period of time.
     * @static
     * @param {any} milliseconds
     * @returns Promise<void>
     */
    public static sleep(milliseconds: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }
    /**
     * @constructor
     */
    constructor() {
    }
//#endregion
}
