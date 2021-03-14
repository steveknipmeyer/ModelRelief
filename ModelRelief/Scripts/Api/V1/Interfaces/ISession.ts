// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {IModel} from "Scripts/Api/V1/Interfaces/IModel";

/**
 * @description Session settings.
 * @interface ISession
 */
export interface ISession extends IModel {

    id?: number;
    name?: string;
    description?: string;

    // active project
    projectId?: number;
}
