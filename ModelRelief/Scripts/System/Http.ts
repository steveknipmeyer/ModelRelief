
// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {Exception} from "Scripts/System/Exception";
import {HttpStatusCode} from "Scripts/System/HttpStatus";
import {RequestResponse} from "Scripts/System/RequestResponse";
import {Services} from "Scripts/System/Services";

/**
 * HTTP Content-type
 */
export enum ContentType {
    Json          = "application/json",
    OctetStream   = "application/octet-stream",
}

/**
 * HTTP Method
 */
export enum MethodType {
    Get = "GET",
    Delete = "DELETE",
    Patch = "PUT",
    Post  = "POST",
    Put = "PUT",
}

/**
 * Server Endpoints
 */
export enum ServerEndPoints {
    ApiCameras          = "api/v1/cameras",
    ApiDepthBuffers     = "api/v1/depth-buffers",
    ApiMeshes           = "api/v1/meshes",
    ApiMeshTransforms   = "api/v1/meshtransforms",
    ApiModels           = "api/v1/models",
    ApiNormalMaps       = "api/v1/normal-maps",
    ApiProjects         = "api/v1/projects",
}

/**
 * HTTP Library
 * General HTML and DOM routines
 * @class
 */
export class HttpLibrary {

    public static HostRoot: string = `${window.location.protocol}//${window.location.host}/`;

    /**
     * Post an XMLHttpRequest.
     * @param endpoint Url endpoint.
     * @param requestData Data for request.
     * @param onComplete  Callback for request completion.
     */
    public static sendXMLHttpRequest(endpoint: string, methodType: MethodType, contentType: ContentType, requestData: Document | BodyInit, onComplete: (request: XMLHttpRequest) => any): void {

        const requestTag = Services.timer.mark(`${methodType} Request: ${endpoint}`);
        const request = new XMLHttpRequest();

        // Abort
        const onAbort = function(this: XMLHttpRequestEventTarget, ev: Event): any {

            Services.defaultLogger.addErrorMessage(`${methodType}: onAbort`);
        };

        // Error
        const onError = function(this: XMLHttpRequestEventTarget, ev: Event): any {

            Services.defaultLogger.addErrorMessage(`${methodType}: onError`);
        };

        // Progress
        const onProgress = function(this: XMLHttpRequestEventTarget, ev: ProgressEvent): any {

            const percentComplete = ((ev.loaded / ev.total) * 100).toFixed(0);
            Services.defaultLogger.addInfoMessage(`${methodType}: onProgress = ${percentComplete}%`);
        };

        // Timeout
        const onTimeout = function(this: XMLHttpRequestEventTarget, ev: ProgressEvent): any {
            Services.defaultLogger.addErrorMessage(`${methodType}: onTimeout`);
        };

        // Load
        const onLoad = function(this: XMLHttpRequestEventTarget, ev: Event): any {

            if (request.readyState === request.DONE) {
                switch (request.status) {
                    // WIP: Are other HTTP status required?
                    case HttpStatusCode.OK:
                    case HttpStatusCode.CREATED:
                        Services.defaultLogger.addInfoMessage(`${methodType}: onLoad`);
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
    public static async largeBufferToStringAsync(buffer: BlobPart): Promise<string> {

        return new Promise<string>((resolve, reject) => {
            const bufferBlob = new Blob([buffer]);
            const fileReader = new FileReader();

            fileReader.onload = (e) => {
                resolve((e.target as any).result);
            };
            fileReader.readAsText(bufferBlob);
        });
    }

    /**
     * Posts a file to the specified URL.
     * @param postUrl Url to post.
     * @param fileData File data, may be binary.
     */
    public static async postFileAsync(postUrl: string, fileData: ArrayBuffer): Promise<IModel> {

        const blob = new Blob([fileData], { type: ContentType.OctetStream });
        const result = await HttpLibrary.submitHttpRequestAsync(postUrl, MethodType.Post, ContentType.OctetStream, blob);
        if (!result.response.ok)
            Exception.throwError(`postFileAsync file: Url = ${postUrl}, status = ${result.response.status}`);

        return result.model;
    }

    /**
     * Submit an HTTP request.
     * @param {string} endpoint Url endpoint.
     * @param {MethodType} methodType HTTP method.
     * @param {ContentType} contentType HTTP content type.
     * @param {any} requestData Data to send in the request.
     */
    public static async submitHttpRequestAsync(endpoint: string, methodType: MethodType, contentType: ContentType, requestData: BodyInit): Promise<RequestResponse> {

        const headers = new Headers({
            "Content-Type": contentType,
            "Accept": "application/json, application/octet-stream",
        });

        const requestMode: RequestMode = "cors";
        const cacheMode: RequestCache = "default";

        // WIP: Credentials must be supplied to use the API.
        //      The browser provides the credentials for Ux Views.
        const init = {
            method: methodType,
            body: requestData,
            headers,
            mode: requestMode,
            cache: cacheMode,
        };

        // https://stackoverflow.com/questions/35711724/progress-indicators-for-fetch
        // See Benjamin Gruenbaum's answer at the bottom.
        const response = await fetch(endpoint, init);
        const contentString = await response.text();

        const result = new RequestResponse(response, contentString);
        if (!result.response.ok)
            Exception.throwError(`submitHttpRequestAsync: Url = ${endpoint}, status = ${result.response.status}`);

        return result;
    }

    /**
     * @constructor
     */
    constructor() {
        // NOP
    }
}

