// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { Services }  from 'Services'

export class Exception {

    /**
     * @constructor
     */
    constructor() {
    }

    /**
     * @description Logs an exception and throws an error.
     * @static
     * @param {string} exceptionMessage Exception message.
     */
    static throwError (exceptionMessage : string) {

        Services.defaultLogger.addErrorMessage(exceptionMessage);
        throw new Error(exceptionMessage);
    }
}
