
// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {ILogger} from "Scripts/System/Logger";
import {Services} from "Scripts/System/Services";

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

    // Protected
    protected _logger: ILogger;

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
