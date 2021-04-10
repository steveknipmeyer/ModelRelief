// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";
import {IValidationError} from "Scripts/FileTransfer/IValidationError";

/**
 * @description Error response from a multipart FormData POST.
 * FE POST FormData from a IFileModel (e.g. Model3d) Create View.
 * BE Controller receives request containing an IFormFile parameter.
 * BE constructs PostFormRequest and displatches to be handled by PostFormRequestHandler.
  * @interface IPostFormErrorResponse
 */
export interface IPostFormErrorResponse  {
    name: string;
    fileName: string;

    errors: [IValidationError];
}
