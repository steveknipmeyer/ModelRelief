// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";
import {IValidationError} from "Scripts/FileTransfer/IValidationError";

/**
 * @description Error response from a multipart FormData POST.
 * FE POSTs FormData from a IFileModel (e.g. Model3d) Create View.
 * BE Controller receives request containing an IFormFile parameter.
 * BE constructs PostFormRequest and displaches to be handled by PostFormRequestHandler.
  * @interface IPostFormResponse
 */
export interface IPostFormResponse  {
    success: boolean;
    redirectToUrl: string;

    name: string;
    fileName: string;

    errors: [IValidationError];
}
