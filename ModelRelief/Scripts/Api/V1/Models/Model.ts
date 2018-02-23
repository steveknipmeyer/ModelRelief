// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE from 'three'

import {ContentType, HttpLibrary, 
        MethodType, ServerEndPoints}        from 'Http'
import { IModel }                           from 'IModel'
import { Services }                         from 'Services'
import { RequestResponse }                  from 'RequestResponse'

/**
 * @description Common base class for all DTO models.
 * @export
 * @class Model
 * @implements {IModel}
 * @template T 
 */
export class Model<T extends IModel> implements IModel{

    id          : number;
    name        : string;  
    description : string;

    endPoint    : string;       // API endpoint

    /**
     * Creates an instance of Model.
     * @param {IModel} [parameters] Initialization parameters.
     */
    constructor (parameters: IModel = {}) {

        let {
            id,
            name,
            description,
    
        } = parameters;

        this.id            = id;
        this.name          = name;
        this.description   = description;
    }     

    /**
     * @description Submits an HTTP request to its API endpoint.
     * @param {string} endPoint API endpoint
     * @param {MethodType} requestType HTTP method.
     * @param {ContentType} contentType MIME type (e.g. JSON, octet-stream)
     * @param {*} requestData Data to send (or null)
     * @returns {Promise<RequestResponse>} 
     */
    async submitRequestAsync(endPoint: string, requestType : MethodType, contentType : ContentType, requestData : any) : Promise<RequestResponse> {

        let exportTag = Services.timer.mark(`${requestType} ${this.constructor.name}`);

        let result = await HttpLibrary.submitHttpRequestAsync(endPoint, requestType, contentType, requestData);

        Services.timer.logElapsedTime(exportTag);

        return result;
    }
    /**
     * @description Returns the derived instance of Model.
     * @param {IModel} parameters 
     * @returns {*} 
     */
    factory(parameters : IModel) : any{};

    /**
     * @description Posts the model to its API endpoint.
     * @returns {Promise<T>} 
     */
    async postAsync() : Promise<T> {

        let newModel = JSON.stringify(this);
        let result = await this.submitRequestAsync(this.endPoint, MethodType.Post, ContentType.Json, newModel);

        return this.factory(result.model) as T;
    }

    /**
     * @description Gets the model from its API endpoint.
     * @returns {Promise<T>} 
     */
    async getAsync() : Promise<T> {

        let endPoint = `${this.endPoint}/${this.id}`;
        let result = await this.submitRequestAsync(endPoint, MethodType.Get, ContentType.Json, null);

        return this.factory(result.model) as T
    }
    
    /**
     * @description Puts the model to its API endpoint.
     * @returns {Promise<T>} 
     */
    async putAsync() : Promise<T> {

        let updatedModel = JSON.stringify(this);
        let endPoint = `${this.endPoint}/${this.id}`;
        let result = await this.submitRequestAsync(endPoint, MethodType.Put, ContentType.Json, updatedModel);

        return this.factory(result.model) as T;
    }
}
