// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
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
    /// JSON error status result returned by the API.
    /// </summary>
    public class ApiError
    {
        public int     HttpStatusCode;
        public int     ApiErrorCode;
        public string  DeveloperMessage;
        public string  ApiReference;
        public IEnumerable<ValidationError> Errors;
    }

    /// <summary>
    /// Error code offsets for resource groups.
    /// Messages for each resource type begin at the offset.
    /// </summary>
    public enum ErrorCodeBase
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
    /// Error code offsets for HTTP method types.
    /// Messages for each method begin at the offset.
    /// </summary>
    public enum HttpRequestBaseOffset
    {
        Unknown         = 0,

        Get             = 1,
        Post            = 2,
        Put             = 3,
        Patch           = 4,
        Delete          = 5,
    }

    /// <summary>
    /// API error codes returned by the controllers.
    /// </summary>
    public enum ApiErrorCode
    {
        // General
        Default                             = ErrorCodeBase.General + 1,
        NullRequest                         = ErrorCodeBase.General + 2,    
        NotFound                            = ErrorCodeBase.General + 3,
        Unauthorized                        = ErrorCodeBase.General + 4,

        // Files
        FileCreation                        = ErrorCodeBase.Files + 1,    
        FileUpdate                          = ErrorCodeBase.Files + 2,
        NoBackingFile                       = ErrorCodeBase.Files + 3,
        
        // Camera
        CameraGetValidationError            = ErrorCodeBase.Camera + HttpRequestBaseOffset.Get,
        CameraPostValidationError           = ErrorCodeBase.Camera + HttpRequestBaseOffset.Post,
        CameraPutValidationError            = ErrorCodeBase.Camera + HttpRequestBaseOffset.Put,
        CameraPatchValidationError          = ErrorCodeBase.Camera + HttpRequestBaseOffset.Patch,
        CameraDeleteValidationError         = ErrorCodeBase.Camera + HttpRequestBaseOffset.Delete,

        // DepthBuffer
        DepthBufferGetValidationError       = ErrorCodeBase.DepthBuffer + HttpRequestBaseOffset.Get,
        DepthBufferPostValidationError      = ErrorCodeBase.DepthBuffer + HttpRequestBaseOffset.Post,
        DepthBufferPutValidationError       = ErrorCodeBase.DepthBuffer + HttpRequestBaseOffset.Put,
        DepthBufferPatchValidationError     = ErrorCodeBase.DepthBuffer + HttpRequestBaseOffset.Patch,
        DepthBufferDeleteValidationError    = ErrorCodeBase.DepthBuffer + HttpRequestBaseOffset.Delete,

        // Mesh
        MeshGetValidationError              = ErrorCodeBase.Mesh + HttpRequestBaseOffset.Get,
        MeshPostValidationError             = ErrorCodeBase.Mesh + HttpRequestBaseOffset.Post,
        MeshPutValidationError              = ErrorCodeBase.Mesh + HttpRequestBaseOffset.Put,
        MeshPatchValidationError            = ErrorCodeBase.Mesh + HttpRequestBaseOffset.Patch,
        MeshDeleteValidationError           = ErrorCodeBase.Mesh + HttpRequestBaseOffset.Delete,

        // MeshTransform
        MeshTransformGetValidationError     = ErrorCodeBase.DepthBuffer + HttpRequestBaseOffset.Get,
        MeshTransformPostValidationError    = ErrorCodeBase.DepthBuffer + HttpRequestBaseOffset.Post,
        MeshTransformPutValidationError     = ErrorCodeBase.DepthBuffer + HttpRequestBaseOffset.Put,
        MeshTransformPatchValidationError   = ErrorCodeBase.DepthBuffer + HttpRequestBaseOffset.Patch,
        MeshTransformDeleteValidationError  = ErrorCodeBase.DepthBuffer + HttpRequestBaseOffset.Delete,

        // Model3d
        ModelGetValidationError             = ErrorCodeBase.Model3d + HttpRequestBaseOffset.Get,
        ModelPostValidationError            = ErrorCodeBase.Model3d + HttpRequestBaseOffset.Post,
        ModelPutValidationError             = ErrorCodeBase.Model3d + HttpRequestBaseOffset.Put,
        ModelPatchValidationError           = ErrorCodeBase.Model3d + HttpRequestBaseOffset.Patch,
        ModelDeleteValidationError          = ErrorCodeBase.Model3d + HttpRequestBaseOffset.Delete,

        // Project
        ProjectgetValidationError           = ErrorCodeBase.Project + HttpRequestBaseOffset.Get,
        ProjectPostValidationError          = ErrorCodeBase.Project + HttpRequestBaseOffset.Post,
        ProjectPutValidationError           = ErrorCodeBase.Project + HttpRequestBaseOffset.Put,
        ProjectPatchValidationError         = ErrorCodeBase.Project + HttpRequestBaseOffset.Patch,
        ProjectDeleteValidationError        = ErrorCodeBase.Project + HttpRequestBaseOffset.Delete,
    }
    

    /// <summary>
    /// Helper class to look up an ApiErrorCode based on the HTTP request and the domain model.
    /// </summary>
    public static class ApiValidationHelper
    {
        /// <summary>
        /// Map a domain model to an API status code base offset.
        /// </summary>
        /// <param name="domainModelType">Domain model type.</param>
        /// <returns>Base of status code.</returns>
        private static ErrorCodeBase MapDomainModelToStatusCodeBase(Type domainModelType)
        {
            // find base offset of domain model
            var baseOffset = ErrorCodeBase.Unknown;

            if (domainModelType == typeof(Domain.Camera))
                baseOffset = ErrorCodeBase.Camera;

            if (domainModelType == typeof(Domain.DepthBuffer))
                baseOffset = ErrorCodeBase.DepthBuffer;

            if (domainModelType == typeof(Domain.Mesh))
                baseOffset = ErrorCodeBase.Mesh;

            if (domainModelType == typeof(Domain.MeshTransform))
                baseOffset = ErrorCodeBase.MeshTransform;

            if (domainModelType == typeof(Domain.Model3d))
                baseOffset = ErrorCodeBase.Model3d;

            if (domainModelType == typeof(Domain.Project))
                baseOffset = ErrorCodeBase.Project;

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

            if (String.Equals(requestType, "PATCH", StringComparison.CurrentCultureIgnoreCase))
                requestOffset = HttpRequestBaseOffset.Patch;

            if (String.Equals(requestType, "DELETE", StringComparison.CurrentCultureIgnoreCase))
                requestOffset = HttpRequestBaseOffset.Delete;

            return requestOffset;
        }

        /// <summary>
        /// Returns an ApiErrorCode for a validation error given the HTTP request and the CQRS request type.
        /// </summary>
        /// <param name="httpRequest">HTTP request.</param>
        /// <param name="apiRequestType">CQRS request.</param>
        /// <returns></returns>
        public static ApiErrorCode MapRequestToApiErrorCode (HttpRequest httpRequest, Type apiRequestType)
        {
            // 1st generic type is the domain model
            Type domainModelType = apiRequestType.GenericTypeArguments?.First();
            if (domainModelType == null)
                return ApiErrorCode.Default;

            var baseOffset = MapDomainModelToStatusCodeBase(domainModelType);
            
            // no domain model match; stop
            if (ErrorCodeBase.Unknown == baseOffset)    
                return ApiErrorCode.Default;

            // now map HTTP request type to an offset
            var requestType = httpRequest.Method;
            var requestOffset = MapRequestTypeToBaseOffset(requestType);

            // no HTTP request type match; stop
            if (HttpRequestBaseOffset.Unknown == requestOffset)    
                return ApiErrorCode.Default;


            var errorCode = (ApiErrorCode) ((int) baseOffset + (int) requestOffset);
            return errorCode;
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
    /// Helper class to construct an API error result.
    /// </summary>
    public class ApiErrorResult
    {
        Controller      _controller;
        HttpStatusCode  _httpStatusCode;
        ApiErrorCode   _apiErrorCode;
        string          _developerMessage;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="controller">Active controller.</param>
        /// <param name="httpStatusCode">HTTP status code to return.</param>
        /// <param name="apiErrorCode">ModelRelief API error code (more specialized than httpStatusCode)</param>
        /// <param name="developerMessage">Additional information for the developer.</param>
        public ApiErrorResult (Controller controller, HttpStatusCode httpStatusCode, ApiErrorCode apiErrorCode, string developerMessage)
        {
            _controller       = controller;
            _httpStatusCode   = httpStatusCode;
            _apiErrorCode     = apiErrorCode;
            _developerMessage = developerMessage;
        }

        /// <summary>
        /// Constructs the ObjectResult that will be later serialized by the middleware into JSON.
        /// </summary>
        /// <returns></returns>
        public ObjectResult ObjectResult(IEnumerable<ValidationFailure> validationFailures = null)
        {
            string documentation = RouteNames.ApiDocumentation;
            string apiReferenceRelative = _controller.Url.RouteUrl(documentation, new {id = (int) _apiErrorCode});
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

            var errorResult = new ApiError()
            {
                HttpStatusCode   = (int) _httpStatusCode,
                ApiErrorCode    = (int) _apiErrorCode,
                DeveloperMessage = _developerMessage,
                ApiReference     = apiReferenceAbsolute,
                Errors           = errors
            };

            var objectResult = new ObjectResult(errorResult);
            objectResult.StatusCode= (int) _httpStatusCode;

            return objectResult;
        }
    }
}