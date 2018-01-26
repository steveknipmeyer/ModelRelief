﻿// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";
         
/**
 * Tool Library
 * General utility routines
 * @class
 */
export class Tools {
    /**
     * @constructor
     */
    constructor() {
    }

//#region Utility
    /// <summary>        
    // Generate a pseudo GUID.
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    /// </summary>
    static generatePseudoGUID() {
      
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
        }
     
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
    }

    /**
     * @description Utility method to sleep for a given period of time.
     * @static
     * @param {any} milliseconds 
     * @returns Promise<void>
     */
    static sleep(milliseconds: number) : Promise<void> {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
        
//#endregion

}
