// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {Services} from "Scripts/System/Services";

export class Exception {

    /**
     * @description Logs an exception and throws an error.
     * @static
     * @param {string} exceptionMessage Exception message.
     */
    public static throwError(exceptionMessage: string) {

        Services.defaultLogger.addErrorMessage(exceptionMessage);
        throw new Error(exceptionMessage);
    }

    /**
     * @constructor
     */
    constructor() {
    }
}
