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

    public class ValidationError
    {
        [JsonProperty(NullValueHandling=NullValueHandling.Ignore)]
        public string Field { get; }

        public string Message { get; }

        public ValidationError(string field, string message)
        {
            Field = (field != String.Empty) ? field : null;
            Message = message;
        }
    }

    public class ApiValidationResult
    {
        Controller   _controller;
        int          _httpStatusCode;
        int          _apiStatusCode;
        string       _developerMessage;

        public ApiValidationResult (Controller controller, int httpStatusCode, int apiStatusCode, string developerMessage)
        {
            _controller       = controller;
            _httpStatusCode   = httpStatusCode;
            _apiStatusCode    = apiStatusCode;
            _developerMessage = developerMessage;
        }

        public ObjectResult ObjectResult()
        {

            string apiReferenceRelative = (_controller).Url.RouteUrl(RouteNames.ApiDocumentation, new {id = _apiStatusCode});
            var apiReferenceAbsolute    = string.Format($"{_controller.HttpContext.Request.Scheme}://{_controller.HttpContext.Request.Host}{apiReferenceRelative}");

            IEnumerable<ValidationError> Errors = _controller.ModelState.Keys
                    .SelectMany(key => _controller.ModelState[key].Errors.Select(x => new ValidationError(key, x.ErrorMessage)))
                    .ToList();

            var jsonResult = new
            {
                httpStatusCode   = _httpStatusCode,
                apiStatusCode    = _apiStatusCode,
                developerMessage = _developerMessage,
                apiReferencee    = apiReferenceAbsolute,
                errors           = Errors
            };

            var objectResult = new ObjectResult(jsonResult);
            objectResult.StatusCode= _httpStatusCode;

            return objectResult;
        }
    }
}