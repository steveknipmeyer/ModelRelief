// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import {DepthBufferFormat}                  from 'DepthBuffer'
import {IFilePath}                          from 'IFilePath'
import {Services}                           from 'Services'
import {ReliefSettings}                     from 'Relief'

/**
 * HTTP Content-type
 */
enum ContentType {
    Json          = 'application/json',
    OctetStream   = 'application/octet-stream'
}

/**
 * HTTP Method
 */
enum MethodType {
    Post  = 'POST',
    Put   = 'PUT'
}

/**
 * Server Endpoints
 */
export enum ServerEndPoints {
        ApiMeshes        = 'api/meshes',
        ApiDepthBuffers  = 'api/depth-buffers'
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
     * Posts a file and the supporting metadata to the specified URL
     * @param postUrl Url to post.
     * @param fileData File data, may be binary.
     * @param fileMetadata JSON metadata
     */
    static postFile (postUrl : string, fileData : any, fileMetadata : IFilePath) : boolean {

       let onComplete = function(request: XMLHttpRequest) {

            Services.consoleLogger.addInfoMessage('File saved');
            let filePath = request.getResponseHeader('Location');
            fileMetadata.path = filePath;

            // now send JSON metadata since we now know the URL
            HttpLibrary.sendXMLHttpRequest(filePath, MethodType.Put, ContentType.Json, JSON.stringify(fileMetadata), null);
        };
        let blob = new Blob([fileData], { type: ContentType.OctetStream }); 
        HttpLibrary.sendXMLHttpRequest(postUrl, MethodType.Post, ContentType.OctetStream, blob, onComplete);

        return true;
    }

    /**
     * Post an XMLHttpRequest.
     * @param endpoint Url endpoint.
     * @param requestData Data for request.
     * @param onComplete  Callback for request completion.
     */
    static sendXMLHttpRequest(endpoint : string, methodType : MethodType, contentType : ContentType, requestData : any, onComplete : (request: XMLHttpRequest) => any): void {

        let exportTag = Services.timer.mark(`${methodType} Request: ${endpoint}`);
        let request = new XMLHttpRequest(); 

        // Abort 
        let onAbort = function (this: XMLHttpRequestEventTarget, ev: Event) : any {

            Services.consoleLogger.addErrorMessage(`${methodType}: onAbort`);
        };

        // Error
        let onError = function (this: XMLHttpRequestEventTarget, ev: ErrorEvent) : any { 

            Services.consoleLogger.addErrorMessage(`${methodType}: onError`);
        };

        // Progress
        let onProgress = function (this: XMLHttpRequestEventTarget, ev: ProgressEvent) : any { 

            let percentComplete = ((ev.loaded / ev.total) * 100).toFixed(0);
            Services.consoleLogger.addInfoMessage(`${methodType}: onProgress = ${percentComplete}%`);
        };

        // Timeout
        let onTimeout = function (this: XMLHttpRequestEventTarget, ev: ProgressEvent) : any {

            Services.consoleLogger.addErrorMessage(`${methodType}: onTimeout`);
        };

        // Load
        let onLoad = function (this: XMLHttpRequestEventTarget, ev: Event) : any {

            if (request.readyState === request.DONE) {
                switch (request.status) {
                    case 200:
                    case 201:
                        Services.consoleLogger.addInfoMessage(`${methodType}: onLoad`);
                        if (onComplete)
                            onComplete(request);
                        break;
                }
            }
        };

        request.onabort    = onAbort;
        request.onerror    = onError;
        request.onload     = onLoad;
        request.ontimeout  = onTimeout;
        request.upload.onprogress = onProgress;

        request.open(methodType, endpoint, true);
        request.setRequestHeader("Content-type", contentType);
        request.send(requestData);

        Services.timer.logElapsedTime(exportTag);
    }        
}
