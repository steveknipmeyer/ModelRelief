// ------------------------------------------------------------------------// 
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

#pragma warning disable 1572, 1573
namespace ModelRelief.Api.V1.DepthBuffers
{
    /// <summary>
    /// DepthBuffer POST model.
    /// </summary>
    public class DepthBufferPostModel : IValidatable<DepthBuffer>
    {
        public byte[] Raw { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="raw">Byte array from the request body</param>
        public DepthBufferPostModel (byte[] raw)
        {
            Raw = raw;
        }

        /// <summary>
        /// Validates the file properties.
        /// </summary>
        /// <param name="modelState">ModelState</param>
        /// <returns>true if valid</returns>
        public bool Validate(ApplicationUser user, ApiController<DepthBuffer> controller, int? id = null)
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
            int apiStatusCode        = (int) ApiStatusCode.DepthBufferPostValidationError,
            string developerMessage  = "The DepthBuffer POST properties are invalid."
            )
        {
            var objectResult = new ApiValidationResult(controller, httpStatusCode, apiStatusCode, developerMessage).ObjectResult();
            return objectResult;
        }
    }
}
