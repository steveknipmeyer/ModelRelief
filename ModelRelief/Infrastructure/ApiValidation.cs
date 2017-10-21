// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;
using System.Linq;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

using Newtonsoft.Json;

namespace ModelRelief.Infrastructure
{
    public enum ApiStatusCode
    {
        // Camera
        CameraPutValidationError            = 1000,

        // DepthBuffer
        DepthBufferPutValidationError       = 2000,

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
        ActionExecutingContext  _context;
        int                     _httpStatusCode;
        int                     _apiStatusCode;
        string                  _developerMessage;

        public ApiValidationResult (ActionExecutingContext context, int httpStatusCode, int apiStatusCode, string developerMessage)
            {
            _context          = context;
            _httpStatusCode   = httpStatusCode;
            _apiStatusCode    = apiStatusCode;
            _developerMessage = developerMessage;
            }

        public ContentResult ContentResult()
            {
            var contentResult = new ContentResult();

            string apiReferenceRelative = ((Controller) _context.Controller).Url.RouteUrl(RouteNames.ApiDocumentation, new {id = _apiStatusCode});
            var apiReferenceAbsolute    = string.Format($"{_context.HttpContext.Request.Scheme}://{_context.HttpContext.Request.Host}{apiReferenceRelative}");

            IEnumerable<ValidationError> Errors = _context.ModelState.Keys
                    .SelectMany(key => _context.ModelState[key].Errors.Select(x => new ValidationError(key, x.ErrorMessage)))
                    .ToList();

            var jsonResult    = new
            {
                httpStatusCode   = _httpStatusCode,
                apiStatusCode    = _apiStatusCode,
                developerMessage = _developerMessage,
                apiReferencee    = apiReferenceAbsolute,
                errors           = Errors
            };

            string content = JsonConvert.SerializeObject(jsonResult,
                new JsonSerializerSettings
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                });
            contentResult.Content = content;
            contentResult.ContentType = "application/json";

            return contentResult;
            }
    }
}