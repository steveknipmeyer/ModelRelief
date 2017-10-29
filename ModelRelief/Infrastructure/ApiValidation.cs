// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ModelRelief.Infrastructure
{
    /// <summary>
    /// JSON status result returned by the API.
    /// </summary>
    public class ApiResult
    {
        public int     HttpStatusCode;
        public int     ApiStatusCode;
        public string  DeveloperMessage;
        public string  ApiReference;
        public IEnumerable<ValidationError> Errors;
    }

    /// <summary>
    /// API status codes returned by the controllers.
    /// </summary>
    public enum ApiStatusCode
    {
        // General
        Default                             = 100,
        FileCreation                        = 101,
        FileUpdate                          = 102,
        
        // Camera
        CameraPutValidationError            = 1000,

        // DepthBuffer
        DepthBufferPutValidationError       = 2000,
        DepthBufferPostValidationError      = 2001,

        // Mesh
        MeshPutValidationError              = 3000,
        MeshPostValidationError             = 3001,

        // MeshTransform
        MeshTransformPutValidationError     = 4000,

        // Model3d
        ModelPutValidationError             = 5000,

        // Project
        ProjectPutValidationError           = 6000
    }

    /// <summary>
    /// Helper class to construct a ModelState ValidationError.
    /// </summary>
    public class ValidationError
    {
        /// <summary>
        /// Model field for the error.
        /// </summary>
        [JsonProperty(NullValueHandling=NullValueHandling.Ignore)]
        public string Field { get; }

        /// <summary>
        /// Error message for the model field.
        /// </summary>
        public string Message { get; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="field">Model field for which the error was generated.</param>
        /// <param name="message">Error message.</param>
        public ValidationError(string field, string message)
        {
            Field = (field != String.Empty) ? field : null;
            Message = message;
        }
    }

    /// <summary>
    /// Helper class to construct a model validation result.
    /// </summary>
    public class ApiValidationResult
    {
        Controller   _controller;
        int          _httpStatusCode;
        int          _apiStatusCode;
        string       _developerMessage;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="controller">Active controller.</param>
        /// <param name="httpStatusCode">HTTP status code to return.</param>
        /// <param name="apiStatusCode">ModelRelief API status code (more specialized than httpStatusCode)</param>
        /// <param name="developerMessage">Additional information for the developer.</param>
        public ApiValidationResult (Controller controller, int httpStatusCode, int apiStatusCode, string developerMessage)
        {
            _controller       = controller;
            _httpStatusCode   = httpStatusCode;
            _apiStatusCode    = apiStatusCode;
            _developerMessage = developerMessage;
        }

        /// <summary>
        /// Constructs the ObjectResult that will be later serialized by the middleware into JSON.
        /// </summary>
        /// <returns></returns>
        public ObjectResult ObjectResult()
        {
            string documentation = RouteNames.ApiDocumentation;
            string apiReferenceRelative = _controller.Url.RouteUrl(documentation, new {id = _apiStatusCode});
            var apiReferenceAbsolute    = string.Format($"{_controller.HttpContext.Request.Scheme}://{_controller.HttpContext.Request.Host}{apiReferenceRelative}");

            IEnumerable<ValidationError> Errors = _controller.ModelState.Keys
                    .SelectMany(key => _controller.ModelState[key].Errors.Select(x => new ValidationError(key, x.ErrorMessage)))
                    .ToList();

            var jsonResult = new ApiResult()
            {
                HttpStatusCode   = _httpStatusCode,
                ApiStatusCode    = _apiStatusCode,
                DeveloperMessage = _developerMessage,
                ApiReference     = apiReferenceAbsolute,
                Errors           = Errors
            };

            var objectResult = new ObjectResult(jsonResult);
            objectResult.StatusCode= _httpStatusCode;

            return objectResult;
        }
    }
}