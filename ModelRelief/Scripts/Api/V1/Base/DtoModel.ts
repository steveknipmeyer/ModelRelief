// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {Exception} from "Scripts/System/Exception";
import {ContentType, HttpLibrary, MethodType} from "Scripts/System/Http";
import {HttpStatusCode} from "Scripts/System/HttpStatus";
import {ILogger} from "Scripts/System/Logger";
import {RequestResponse} from "Scripts/System/RequestResponse";
import {Services} from "Scripts/System/Services";

// ---------------------------------------------------------------------------------------------------------------------------------------------//
//                                                              Base Classes                                                                    //
// ---------------------------------------------------------------------------------------------------------------------------------------------//
/**
 * @description Common base class for all DTO models.
 * @export
 * @class Model
 * @implements {IModel}
 * @template T
 */
export class DtoModel<T extends IModel> implements IModel {

    public id: number;
    public name: string;
    public description: string;

    public endPoint: string;       // API endpoint

    // Private
    private _logger: ILogger;

    /**
     * Creates an instance of Model.
     * @param {IModel} [parameters] Initialization parameters.
     */
    constructor(parameters: IModel = {}) {

        const {
            id,
            name,
            description,

        } = parameters;

        this.id = id;
        this.name = name;
        this.description = description;

        this._logger = Services.defaultLogger;
    }

    /**
     * @description Submits an HTTP request to its API endpoint.
     * @param {string} endPoint API endpoint
     * @param {MethodType} requestType HTTP method.
     * @param {ContentType} contentType MIME type (e.g. JSON, octet-stream)
     * @param {*} requestData Data to send (or null)
     * @returns {Promise<RequestResponse>}
     */
    public async submitRequestAsync(endPoint: string, requestType: MethodType, contentType: ContentType, requestData: string): Promise<RequestResponse> {

        const exportTag = Services.timer.mark(`${requestType} ${this.constructor.name}`);

        const result = await HttpLibrary.submitHttpRequestAsync(endPoint, requestType, contentType, requestData);

        Services.timer.logElapsedTime(exportTag);

        return result;
    }
    /**
     * @description Returns the derived instance of Model.
     * @param {IModel} parameters
     * @returns {*}
     */
    public factory(parameters: IModel): any {
        // NOP
    }

    /**
     * @description Posts the model to its API endpoint.
     * @returns {Promise<T>}
     */
    public async postAsync(): Promise<T> {

        const newModel = JSON.stringify(this);
        const result = await this.submitRequestAsync(this.endPoint, MethodType.Post, ContentType.Json, newModel);
        if (result.response.status !== HttpStatusCode.CREATED)
            Exception.throwError(`postFileAsync model: Url = ${this.endPoint}, status = ${result.response.status}`);

        return this.factory(await result.modelAsync()) as T;
    }

    /**
     * @description Gets the model from its API endpoint.
     * @returns {Promise<T>}
     */
    public async getAsync(): Promise<T> {

        if (!this.id)
            return undefined;

        const endPoint = `${this.endPoint}/${this.id}`;
        const result = await this.submitRequestAsync(endPoint, MethodType.Get, ContentType.Json, null);

        return this.factory(await result.modelAsync()) as T;
    }

    /**
     * @description Puts the model to its API endpoint.
     * @returns {Promise<T>}
     */
    public async putAsync(): Promise<T> {

        const updatedModel = JSON.stringify(this);
        const endPoint = `${this.endPoint}/${this.id}`;
        const result = await this.submitRequestAsync(endPoint, MethodType.Put, ContentType.Json, updatedModel);

        return this.factory(await result.modelAsync()) as T;
    }
}
