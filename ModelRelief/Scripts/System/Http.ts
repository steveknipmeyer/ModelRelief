﻿// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import {Services}                           from 'Services'

/**
 * HTTP Library
 * General HTML and DOM routines
 * @class
 */
export class HttpLibrary {
    /**
     * @constructor
     */
    constructor() {
    }

    static postRequest(postUrl : string, postContents : any, onLoad : (this: XMLHttpRequestEventTarget, ev: Event) => any): void {

        let exportTag = Services.timer.mark(`Post Request: ${postUrl}`);

        // Abort 
        let onAbort = function (this: XMLHttpRequestEventTarget, ev: Event) : any {

            Services.consoleLogger.addErrorMessage('postRequest: onAbort');
        };

        // Error
        let onError = function (this: XMLHttpRequestEventTarget, ev: ErrorEvent) : any { 

            Services.consoleLogger.addErrorMessage('postRequest: onError');
        };

        // Progress
        let onProgress = function (this: XMLHttpRequestEventTarget, ev: ProgressEvent) : any { 

            let percentComplete = ((ev.loaded / ev.total) * 100).toFixed(0);
            Services.consoleLogger.addInfoMessage(`postRequest: onProgress = ${percentComplete}%`);
        };

        // Timeout
        let onTimeout = function (this: XMLHttpRequestEventTarget, ev: ProgressEvent) : any {

            Services.consoleLogger.addErrorMessage('postRequest: onTimeout');
        };

        let request = new XMLHttpRequest(); 
        request.onabort    = onAbort;
        request.onerror    = onError;
        request.onload     = onLoad;
        request.ontimeout  = onTimeout;

        request.upload.onprogress = onProgress;
        
        let blob = new Blob([postContents], { type: 'text/plain' }); 
        request.open("POST", postUrl, true);
        request.send(blob)

        Services.timer.logElapsedTime(exportTag);
    }        
}
