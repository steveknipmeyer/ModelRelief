// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Infrastructure;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace ModelRelief.Api.V2.Shared.Rest
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

    public enum StatusCodeBaseOffsets
    {
        Unknown         = 0,

        General         = 100,
        Files           = 500,

        Camera          = 1000,
        DepthBuffer     = 2000,
        Mesh            = 3000,
        MeshTransform   = 4000,
        Model3d         = 5000,
        Project         = 6000,
    }

    public enum HttpRequestBaseOffsets
    {
        Unknown         = 0,

        Get             = 1,
        Post            = 2,
        Put             = 3,
        Delete          = 4,
    }

    /// <summary>
    /// API status codes returned by the controllers.
    /// </summary>
    public enum ApiStatusCode
    {
        // General
        Default                             = StatusCodeBaseOffsets.General + 1,
        NullRequest                         = StatusCodeBaseOffsets.General + 2,    
        NotFound                            = StatusCodeBaseOffsets.General + 3,

        // Files
        FileCreation                        = StatusCodeBaseOffsets.Files + 1,    
        FileUpdate                          = StatusCodeBaseOffsets.Files + 2,
        
        // Camera
        CameraGetValidationError            = StatusCodeBaseOffsets.Camera + HttpRequestBaseOffsets.Get,
        CameraPostValidationError           = StatusCodeBaseOffsets.Camera + HttpRequestBaseOffsets.Post,
        CameraPutValidationError            = StatusCodeBaseOffsets.Camera + HttpRequestBaseOffsets.Put,
        CameraDeleteValidationError            = StatusCodeBaseOffsets.Camera + HttpRequestBaseOffsets.Delete,

        // DepthBuffer
        DepthBufferGetValidationError       = StatusCodeBaseOffsets.DepthBuffer + HttpRequestBaseOffsets.Get,
        DepthBufferPostValidationError      = StatusCodeBaseOffsets.DepthBuffer + HttpRequestBaseOffsets.Post,
        DepthBufferPutValidationError       = StatusCodeBaseOffsets.DepthBuffer + HttpRequestBaseOffsets.Put,
        DepthBufferDeleteValidationError    = StatusCodeBaseOffsets.DepthBuffer + HttpRequestBaseOffsets.Delete,

        // Mesh
        MeshGetValidationError              = StatusCodeBaseOffsets.Mesh + HttpRequestBaseOffsets.Get,
        MeshPostValidationError             = StatusCodeBaseOffsets.Mesh + HttpRequestBaseOffsets.Post,
        MeshPutValidationError              = StatusCodeBaseOffsets.Mesh + HttpRequestBaseOffsets.Put,
        MeshDeleteValidationError           = StatusCodeBaseOffsets.Mesh + HttpRequestBaseOffsets.Delete,

        // MeshTransform
        MeshTransformGetValidationError     = StatusCodeBaseOffsets.DepthBuffer + HttpRequestBaseOffsets.Get,
        MeshTransformPostValidationError    = StatusCodeBaseOffsets.DepthBuffer + HttpRequestBaseOffsets.Post,
        MeshTransformPutValidationError     = StatusCodeBaseOffsets.DepthBuffer + HttpRequestBaseOffsets.Put,
        MeshTransformDeleteValidationError  = StatusCodeBaseOffsets.DepthBuffer + HttpRequestBaseOffsets.Delete,

        // Model3d
        ModelGetValidationError             = StatusCodeBaseOffsets.Model3d + HttpRequestBaseOffsets.Get,
        ModelPostValidationError            = StatusCodeBaseOffsets.Model3d + HttpRequestBaseOffsets.Post,
        ModelPutValidationError             = StatusCodeBaseOffsets.Model3d + HttpRequestBaseOffsets.Put,
        ModelDeleteValidationError          = StatusCodeBaseOffsets.Model3d + HttpRequestBaseOffsets.Delete,

        // Project
        ProjectgetValidationError           = StatusCodeBaseOffsets.Project + HttpRequestBaseOffsets.Get,
        ProjectPostValidationError          = StatusCodeBaseOffsets.Project + HttpRequestBaseOffsets.Post,
        ProjectPutValidationError           = StatusCodeBaseOffsets.Project + HttpRequestBaseOffsets.Put,
        ProjectDeleteValidationError        = StatusCodeBaseOffsets.Project + HttpRequestBaseOffsets.Delete,
    }

    /// <summary>
    /// Helper class to look up an ApiStatusCode based on the HTTP request and the domain model.
    /// </summary>
    public static class ApiValidationHelper
    {
        /// <summary>
        /// Returns an ApiStatusCode for a validation error given the HTTP request and the CQRS request type.
        /// </summary>
        /// <param name="httpRequest">HTTP request.</param>
        /// <param name="apiRequestType">CQRS request.</param>
        /// <returns></returns>
        public static ApiStatusCode MapRequestToApiStatusCode (HttpRequest httpRequest, Type apiRequestType)
        {
            // 1st generic type is the domain model
            Type domainModelType = apiRequestType.GenericTypeArguments?.First();

            if (domainModelType == null)
                return ApiStatusCode.Default;

            // find base offset of domain model
            var baseOffset = StatusCodeBaseOffsets.Unknown;

            if (domainModelType == typeof(Domain.Camera))
                baseOffset = StatusCodeBaseOffsets.Camera;

            if (domainModelType == typeof(Domain.DepthBuffer))
                baseOffset = StatusCodeBaseOffsets.DepthBuffer;

            if (domainModelType == typeof(Domain.Mesh))
                baseOffset = StatusCodeBaseOffsets.Mesh;

            if (domainModelType == typeof(Domain.MeshTransform))
                baseOffset = StatusCodeBaseOffsets.MeshTransform;

            if (domainModelType == typeof(Domain.Model3d))
                baseOffset = StatusCodeBaseOffsets.Model3d;

            if (domainModelType == typeof(Domain.Project))
                baseOffset = StatusCodeBaseOffsets.Project;

            // no domain model match; stop
            if (baseOffset == StatusCodeBaseOffsets.Unknown)
                return ApiStatusCode.Default;



            // now map HTTP request type to an offet
            var requestOffset = HttpRequestBaseOffsets.Unknown;

            var requestType = httpRequest.Method;

            if (String.Equals(requestType, "GET", StringComparison.CurrentCultureIgnoreCase))
                requestOffset = HttpRequestBaseOffsets.Get;

            if (String.Equals(requestType, "POST", StringComparison.CurrentCultureIgnoreCase))
                requestOffset = HttpRequestBaseOffsets.Post;

            if (String.Equals(requestType, "PUT", StringComparison.CurrentCultureIgnoreCase))
                requestOffset = HttpRequestBaseOffsets.Put;

            if (String.Equals(requestType, "DELETE", StringComparison.CurrentCultureIgnoreCase))
                requestOffset = HttpRequestBaseOffsets.Delete;

            // no HTTP request type match; stop
            if (requestOffset == HttpRequestBaseOffsets.Unknown)
                return ApiStatusCode.Default;


            var statusCode = (ApiStatusCode) ((int) baseOffset + (int) requestOffset);
            return statusCode;
        }
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
        Controller      _controller;
        HttpStatusCode  _httpStatusCode;
        ApiStatusCode   _apiStatusCode;
        string          _developerMessage;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="controller">Active controller.</param>
        /// <param name="httpStatusCode">HTTP status code to return.</param>
        /// <param name="apiStatusCode">ModelRelief API status code (more specialized than httpStatusCode)</param>
        /// <param name="developerMessage">Additional information for the developer.</param>
        public ApiValidationResult (Controller controller, HttpStatusCode httpStatusCode, ApiStatusCode apiStatusCode, string developerMessage)
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
            string apiReferenceRelative = _controller.Url.RouteUrl(documentation, new {id = (int) _apiStatusCode});
            var apiReferenceAbsolute    = string.Format($"{_controller.HttpContext.Request.Scheme}://{_controller.HttpContext.Request.Host}{apiReferenceRelative}");

            IEnumerable<ValidationError> Errors = _controller.ModelState.Keys
                    .SelectMany(key => _controller.ModelState[key].Errors.Select(x => new ValidationError(key, x.ErrorMessage)))
                    .ToList();

            var jsonResult = new ApiResult()
            {
                HttpStatusCode   = (int) _httpStatusCode,
                ApiStatusCode    = (int) _apiStatusCode,
                DeveloperMessage = _developerMessage,
                ApiReference     = apiReferenceAbsolute,
                Errors           = Errors
            };

            var objectResult = new ObjectResult(jsonResult);
            objectResult.StatusCode= (int) _httpStatusCode;

            return objectResult;
        }
    }
}