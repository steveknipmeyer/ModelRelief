// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {DepthBufferFormat}                  from 'DepthBuffer'
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
    Get = 'GET',
    Delete = 'DELETE',
    Patch = 'PUT',
    Post  = 'POST',
    Put = 'PUT',
}

/**
 * Server Endpoints
 */
export enum ServerEndPoints {
        ApiMeshes        = 'api/v1/meshes',
        ApiDepthBuffers  = 'api/v1/depth-buffers'
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
     * Posts a file and the supporting metadata to the specified URL.
     * @param postUrl Url to post.
     * @param fileData File data, may be binary.
     * @param fileMetadata JSON metadata.
     */
    static postFile (postUrl : string, fileData : any, fileMetadata : any) : boolean {

       let onComplete = function(request: XMLHttpRequest) {

            Services.consoleLogger.addInfoMessage('Metadata saved');
            let filePath = request.getResponseHeader('Location');

            let blob = new Blob([fileData], { type: ContentType.OctetStream }); 
            HttpLibrary.sendXMLHttpRequest(`${filePath}/file`, MethodType.Post, ContentType.OctetStream, blob, null);
        };

        // send JSON metadata first to create the resource and obtain the Id
        HttpLibrary.sendXMLHttpRequest(postUrl, MethodType.Post, ContentType.Json, JSON.stringify(fileMetadata), onComplete);

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
