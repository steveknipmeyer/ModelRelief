// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { ILogger } from "../../../System/Logger";
import { Services } from "../../../System/Services";
import { IModel } from "../Interfaces/IModel";

/**
 * @description Common base class for all FE models.
 * @export
 * @class Model
 * @implements {IModel}
 */
export class Model implements IModel {

    public id: number;
    public name: string;
    public description: string;

    // Private
    public _logger: ILogger;

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

        this.id            = id;
        this.name          = name;
        this.description   = description;

        this._logger = Services.defaultLogger;
    }
}
