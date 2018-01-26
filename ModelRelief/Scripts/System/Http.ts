// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto                             from 'DtoModels'

import { DepthBufferFormat }                from 'DepthBuffer'
import { HttpStatusCode, HttpStatusMessage }from 'HttpStatus'
import { ITGetModel }                       from 'ITGetModel'
import { Services }                         from 'Services'
import { MeshTransform }                    from 'MeshTransform'

/**
 * HTTP Content-type
 */
export enum ContentType {
    Json          = 'application/json',
    OctetStream   = 'application/octet-stream'
}

/**
 * HTTP Method
 */
export enum MethodType {
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
    ApiCameras          = 'api/v1/cameras',
    ApiDepthBuffers     = 'api/v1/depth-buffers',
    ApiMeshes           = 'api/v1/meshes',
    ApiMeshTransforms   = 'api/v1/meshtransforms',
    ApiModels           = 'api/v1/models',
    ApiProjects         = 'api/v1/projects',    
}

/**
 * Represents the result of a client request.
 */
export class RequestResponse {

    response: Response;
    contentString: string;

    /**
     * Constructs an instance of a RequestResponse.
     * @param {Response} response Raw response from the request.
     * @param {string} contentString Response body content;
     */
    constructor(response: Response, contentString : string) {

        this.response = response;
        this.contentString = contentString;
    }

    /**
     * Gets the JSON representation of the response.
     */
    get model(): ITGetModel {

        return JSON.parse(this.contentString) as ITGetModel;
    }

    /**
     * Gets the raw Uint8Array representation of the response.
     */
    get byteArray(): Uint8Array {

        // https://jsperf.com/string-to-uint8array
        let stringLength = this.contentString.length;
        let array = new Uint8Array(stringLength);
        for (var iByte = 0; iByte < stringLength; ++iByte) {
            array[iByte] = this.contentString.charCodeAt(iByte);
        }
        return array;
    }
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

        let requestTag = Services.timer.mark(`${methodType} Request: ${endpoint}`);
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
                    // WIP: Are other HTTP status required?
                    case HttpStatusCode.OK:
                    case HttpStatusCode.CREATED:
                        Services.consoleLogger.addInfoMessage(`${methodType}: onLoad`);
                        if (onComplete)
                            onComplete(request);
                        break;

                    default:
                        // WIP: This is an unexpected condition. Should this method return a value such as false?
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

        Services.timer.logElapsedTime(requestTag);
    }  

    /**
     * Converts an array buffer to a string
     * https://ourcodeworld.com/articles/read/164/how-to-convert-an-uint8array-to-string-in-javascript
     * N.B. Firefox (57) does not support Request.body.getReader which returns an array of Uint8 bytes,
     * @param {Uint8} buffer The buffer to convert.
     * @param {Function} callback The function to call when conversion is complete.
     */
    static async largeBufferToStringAsync(buffer) : Promise<string> {

        return new Promise<string>((resolve, reject) => {
            var bufferBlob = new Blob([buffer]);
            var fileReader = new FileReader();

            fileReader.onload = function(e) {
                resolve((<any>e.target).result);
            };
            fileReader.readAsText(bufferBlob);
        });
    }

    /**
     * Posts a file and the supporting metadata to the specified URL.
     * @param postUrl Url to post.
     * @param fileData File data, may be binary.
     * @param fileMetadata JSON metadata.
     */
    static async postFileAsync(postUrl: string, fileData: any, fileMetadata: any): Promise<boolean> {

        // send JSON metadata first to create the resource and obtain the Id
        let json = JSON.stringify(fileMetadata);
        let result = await HttpLibrary.submitHttpRequestAsync(postUrl, MethodType.Post, ContentType.Json, json);
        if (result.response.status != HttpStatusCode.CREATED) {
            throw new Error(`postFileAsync : Url = ${postUrl}, status = ${result.response.status}`);
        }

        let headers = result.response.headers;
        let filePath = headers.get('Location');

        let blob = new Blob([fileData], { type: ContentType.OctetStream });
        result = await HttpLibrary.submitHttpRequestAsync(`${filePath}/file`, MethodType.Post, ContentType.OctetStream, blob);

        return result.response.ok;
    }

    /**
     * Submit an HTTP request.
     * @param {string} endpoint Url endpoint.
     * @param {MethodType} methodType HTTP method.
     * @param {ContentType} contentType HTTP content type.
     * @param {any} requestData Data to send in the request.
     */
    static async submitHttpRequestAsync(endpoint: string, methodType: MethodType, contentType: ContentType, requestData: any) : Promise<RequestResponse>{

        let headers = new Headers({
            'Content-Type': contentType
        });
        
        let requestMode: RequestMode = 'cors';
        let cacheMode: RequestCache = 'default';

        // WIP: Credentials must be supplied to use the API. 
        //      The browser provides the credentials for Ux Views.
        let init = {
            method: methodType,
            body: requestData,
            headers: headers,
            mode: requestMode,
            cache: cacheMode,
        };

        let response = await fetch(endpoint, init);
        let contentString = await response.text();

        let result = new RequestResponse(response, contentString);
        return result;
    }
}

