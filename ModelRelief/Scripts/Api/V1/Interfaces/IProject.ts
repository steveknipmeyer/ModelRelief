// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { IModel } from "./IModel";

export interface IProject extends IModel {

    id?: number;
    name?: string;
    description?: string;
}


