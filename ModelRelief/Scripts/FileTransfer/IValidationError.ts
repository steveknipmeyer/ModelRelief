// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

/**
 * @description ValidationError interface for validation errors returned by core.
 * @interface IValidationError
 */
export interface IValidationError  {

        field: string;
        message: string
}
