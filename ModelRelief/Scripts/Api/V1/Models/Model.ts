// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE from 'three'

import { Camera }                           from 'Camera';
import { Exception }                        from 'Exception';
import {ContentType, HttpLibrary, 
        MethodType, ServerEndPoints}        from 'Http'
import { ILogger, HTMLLogger }              from 'Logger'
import { IModel }                           from 'IModel'
import { Services }                         from 'Services'
import { RequestResponse }                  from 'RequestResponse'

/**
 * @description Common base class for all FE models.
 * @export
 * @class Model
 * @implements {IModel}
 */
export class Model implements IModel{

    id          : number;
    name        : string;  
    description : string;

    endPoint    : string;       // API endpoint

    // Private
    _logger     : ILogger;

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

        this._logger = Services.defaultLogger;       
    }     
}
