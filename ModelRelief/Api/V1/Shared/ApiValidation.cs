// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Infrastructure;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace ModelRelief.Api.V1.Shared.Rest
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
    /// Status code offsets for resource groups.
    /// Messages for each resource type begin at the offset.
    /// </summary>
    public enum StatusCodeBase
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

    /// <summary>
    /// Status code offsets for HTTP method types.
    /// Messages for each method begin at the offset.
    /// </summary>
    public enum HttpRequestBaseOffset
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
        Default                             = StatusCodeBase.General + 1,
        NullRequest                         = StatusCodeBase.General + 2,    
        NotFound                            = StatusCodeBase.General + 3,
        Unauthorized                        = StatusCodeBase.General + 4,

        // Files
        FileCreation                        = StatusCodeBase.Files + 1,    
        FileUpdate                          = StatusCodeBase.Files + 2,
        
        // Camera
        CameraGetValidationError            = StatusCodeBase.Camera + HttpRequestBaseOffset.Get,
        CameraPostValidationError           = StatusCodeBase.Camera + HttpRequestBaseOffset.Post,
        CameraPutValidationError            = StatusCodeBase.Camera + HttpRequestBaseOffset.Put,
        CameraDeleteValidationError            = StatusCodeBase.Camera + HttpRequestBaseOffset.Delete,

        // DepthBuffer
        DepthBufferGetValidationError       = StatusCodeBase.DepthBuffer + HttpRequestBaseOffset.Get,
        DepthBufferPostValidationError      = StatusCodeBase.DepthBuffer + HttpRequestBaseOffset.Post,
        DepthBufferPutValidationError       = StatusCodeBase.DepthBuffer + HttpRequestBaseOffset.Put,
        DepthBufferDeleteValidationError    = StatusCodeBase.DepthBuffer + HttpRequestBaseOffset.Delete,

        // Mesh
        MeshGetValidationError              = StatusCodeBase.Mesh + HttpRequestBaseOffset.Get,
        MeshPostValidationError             = StatusCodeBase.Mesh + HttpRequestBaseOffset.Post,
        MeshPutValidationError              = StatusCodeBase.Mesh + HttpRequestBaseOffset.Put,
        MeshDeleteValidationError           = StatusCodeBase.Mesh + HttpRequestBaseOffset.Delete,

        // MeshTransform
        MeshTransformGetValidationError     = StatusCodeBase.DepthBuffer + HttpRequestBaseOffset.Get,
        MeshTransformPostValidationError    = StatusCodeBase.DepthBuffer + HttpRequestBaseOffset.Post,
        MeshTransformPutValidationError     = StatusCodeBase.DepthBuffer + HttpRequestBaseOffset.Put,
        MeshTransformDeleteValidationError  = StatusCodeBase.DepthBuffer + HttpRequestBaseOffset.Delete,

        // Model3d
        ModelGetValidationError             = StatusCodeBase.Model3d + HttpRequestBaseOffset.Get,
        ModelPostValidationError            = StatusCodeBase.Model3d + HttpRequestBaseOffset.Post,
        ModelPutValidationError             = StatusCodeBase.Model3d + HttpRequestBaseOffset.Put,
        ModelDeleteValidationError          = StatusCodeBase.Model3d + HttpRequestBaseOffset.Delete,

        // Project
        ProjectgetValidationError           = StatusCodeBase.Project + HttpRequestBaseOffset.Get,
        ProjectPostValidationError          = StatusCodeBase.Project + HttpRequestBaseOffset.Post,
        ProjectPutValidationError           = StatusCodeBase.Project + HttpRequestBaseOffset.Put,
        ProjectDeleteValidationError        = StatusCodeBase.Project + HttpRequestBaseOffset.Delete,
    }
    

    /// <summary>
    /// Helper class to look up an ApiStatusCode based on the HTTP request and the domain model.
    /// </summary>
    public static class ApiValidationHelper
    {
        /// <summary>
        /// Map a domain model to an API status code base offset.
        /// </summary>
        /// <param name="domainModelType">Domain model type.</param>
        /// <returns>Base of status code.</returns>
        private static StatusCodeBase MapDomainModelToStatusCodeBase(Type domainModelType)
        {
            // find base offset of domain model
            var baseOffset = StatusCodeBase.Unknown;

            if (domainModelType == typeof(Domain.Camera))
                baseOffset = StatusCodeBase.Camera;

            if (domainModelType == typeof(Domain.DepthBuffer))
                baseOffset = StatusCodeBase.DepthBuffer;

            if (domainModelType == typeof(Domain.Mesh))
                baseOffset = StatusCodeBase.Mesh;

            if (domainModelType == typeof(Domain.MeshTransform))
                baseOffset = StatusCodeBase.MeshTransform;

            if (domainModelType == typeof(Domain.Model3d))
                baseOffset = StatusCodeBase.Model3d;

            if (domainModelType == typeof(Domain.Project))
                baseOffset = StatusCodeBase.Project;

            // no domain model match
            return baseOffset;
        }

        /// <summary>
        /// Map an HTTP request type to a status code offset from the base resource.
        /// </summary>
        /// <param name="requestType">HTTP request.</param>
        /// <returns>Offset of status code message from base.</returns>
        private static HttpRequestBaseOffset MapRequestTypeToBaseOffset (string requestType)
        {
            // now map HTTP request type to an offset
            var requestOffset = HttpRequestBaseOffset.Unknown;

            if (String.Equals(requestType, "GET", StringComparison.CurrentCultureIgnoreCase))
                requestOffset = HttpRequestBaseOffset.Get;

            if (String.Equals(requestType, "POST", StringComparison.CurrentCultureIgnoreCase))
                requestOffset = HttpRequestBaseOffset.Post;

            if (String.Equals(requestType, "PUT", StringComparison.CurrentCultureIgnoreCase))
                requestOffset = HttpRequestBaseOffset.Put;

            if (String.Equals(requestType, "DELETE", StringComparison.CurrentCultureIgnoreCase))
                requestOffset = HttpRequestBaseOffset.Delete;

            return requestOffset;
        }

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

            var baseOffset = MapDomainModelToStatusCodeBase(domainModelType);
            
            // no domain model match; stop
            if (StatusCodeBase.Unknown == baseOffset)    
                return ApiStatusCode.Default;

            // now map HTTP request type to an offset
            var requestType = httpRequest.Method;
            var requestOffset = MapRequestTypeToBaseOffset(requestType);

            // no HTTP request type match; stop
            if (HttpRequestBaseOffset.Unknown == requestOffset)    
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
        public ObjectResult ObjectResult(IEnumerable<ValidationFailure> validationFailures = null)
        {
            string documentation = RouteNames.ApiDocumentation;
            string apiReferenceRelative = _controller.Url.RouteUrl(documentation, new {id = (int) _apiStatusCode});
            var apiReferenceAbsolute = string.Format($"{_controller.HttpContext.Request.Scheme}://{_controller.HttpContext.Request.Host}{apiReferenceRelative}");

            var errors = new List<ValidationError>();
            if (null != validationFailures)
            {
                foreach (var validationFailure in validationFailures)
                {
                    var qualifiedPropertyName = validationFailure.PropertyName;
                    var segments = qualifiedPropertyName.Split('.');
                    var propertyName = segments.Last();
                    var message = validationFailure.ErrorMessage;
                    errors.Add (new ValidationError(field: propertyName, message: message));
                }
            }

            var jsonResult = new ApiResult()
            {
                HttpStatusCode   = (int) _httpStatusCode,
                ApiStatusCode    = (int) _apiStatusCode,
                DeveloperMessage = _developerMessage,
                ApiReference     = apiReferenceAbsolute,
                Errors           = errors
            };

            var objectResult = new ObjectResult(jsonResult);
            objectResult.StatusCode= (int) _httpStatusCode;

            return objectResult;
        }
    }
}