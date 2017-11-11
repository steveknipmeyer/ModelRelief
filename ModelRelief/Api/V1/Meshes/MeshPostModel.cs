﻿// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Domain;
using ModelRelief.Infrastructure;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ModelRelief.Api.V1.Meshes
{
    /// <summary>
    /// Mesh POST model.
    /// </summary>
    public class MeshPostModel : IValidatable<Mesh>
    {
        public byte[] Raw { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="raw">Byte array from the request body</param>
        public MeshPostModel (byte[] raw)
        {
            Raw = raw;
        }

        /// <summary>
        /// Validates the file properties.
        /// </summary>
        /// <param name="modelState">ModelState</param>
        /// <returns>true if valid</returns>
        public bool Validate(ApplicationUser user, ApiController<Mesh> controller, int? id = null)
        {
            var results = new List<ValidationResult>();

            return controller.ModelState.IsValid;
        }

        /// <summary>
        /// Formats a JSON object containing the extended error result.
        /// </summary>
        /// <param name="controller">Active controller</param>
        /// <returns>Api JSON result</returns>
        public ObjectResult ErrorResult (Controller controller,
            int httpStatusCode       = StatusCodes.Status400BadRequest,
            int apiStatusCode        = (int) ApiStatusCode.MeshPostValidationError,
            string developerMessage  = "The Mesh POST properties are invalid."
            )
        {
            var objectResult = new ApiValidationResult(controller, httpStatusCode, apiStatusCode, developerMessage).ObjectResult();
            return objectResult;
        }
    }
}