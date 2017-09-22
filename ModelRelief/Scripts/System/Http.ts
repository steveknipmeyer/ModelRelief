// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import {DepthBufferFormat}                  from 'DepthBuffer'
import {Services}                           from 'Services'
import {ReliefSettings}                     from 'Relief'

export enum ServerEndPoints {
        ApiMeshes        = 'api/meshes',
        ApiDepthBuffers  = 'api/depthbuffers'
    }

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

    /**
     * Post an XMLHttpRequest.
     * @param postUrl Url to post.
     * @param postContents Contents to post. Converted to Blob.
     * @param onLoad  Callback for post complete.
     */
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
/*        
        // file
        let blob = new Blob([postContents], { type: 'application/octet-stream' }); 
        request.open("POST", postUrl, true);
        request.send(blob)
*/
        // metadata
        let fileMetadata = JSON.stringify({name : postUrl});
        request.open("POST", postUrl, true);
        request.setRequestHeader("Content-type", "application/json");
        request.send(fileMetadata);

        Services.timer.logElapsedTime(exportTag);
    }        
}
