// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { assert }                   from 'chai'
import { IModel }                   from 'IModel'
import { ILogger, ConsoleLogger }   from 'Logger'
import { Services }                 from 'Services'

/**
 * @description Common base class for all application models based on DTO IModel models.
 * @export
 * @class Model
 * @implements {IModel}
 * @template T 
 */
export class Model<T extends IModel> implements IModel {

    id          : number;
    name        : string;  
    description : string;

    /**
     * Creates an instance of Model.
     * @param {IModel} parameters 
     */
    constructor (parameters: IModel) {
        let {
            id,
            name,
            description,
        } = parameters;

        this.id            = id;
        this.name          = name;
        this.description   = description;
    }        
}
