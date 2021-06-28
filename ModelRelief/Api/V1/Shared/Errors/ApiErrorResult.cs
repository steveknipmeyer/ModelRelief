// -----------------------------------------------------------------------
// <copyright file="ApiErrorResult.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Errors
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using FluentValidation.Results;
    using Microsoft.AspNetCore.Mvc;
    using ModelRelief.Infrastructure;
    using Newtonsoft.Json;

    /// <summary>
    /// Helper class to construct an API error result.
    /// </summary>
    public class ApiErrorResult
    {
        public Controller Controller { get; set; }
        public HttpStatusCode HttpStatusCode { get; set; }
        public ApiErrorCode ApiErrorCode { get; set; }
        public string DeveloperMessage { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ApiErrorResult"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="controller">Active controller.</param>
        /// <param name="httpStatusCode">HTTP status code to return.</param>
        /// <param name="apiErrorCode">ModelRelief API error code (more specialized than httpStatusCode)</param>
        /// <param name="developerMessage">Additional information for the developer.</param>
        public ApiErrorResult(Controller controller, HttpStatusCode httpStatusCode, ApiErrorCode apiErrorCode, string developerMessage)
        {
            Controller       = controller;
            HttpStatusCode   = httpStatusCode;
            ApiErrorCode     = apiErrorCode;
            DeveloperMessage = developerMessage;
        }

        /// <summary>
        /// Constructs the ObjectResult that will be later serialized by the middleware into JSON.
        /// </summary>
        /// <param name="validationFailures">Collection of validation errors.</param>
        public ObjectResult ObjectResult(IEnumerable<ValidationFailure> validationFailures = null)
        {
            string documentation = RouteNames.ApiDocumentation;
            string apiReferenceRelative = Controller.Url.RouteUrl(documentation, new { id = (int)ApiErrorCode });
            var apiReferenceAbsolute = string.Format($"{Controller.HttpContext.Request.Scheme}://{Controller.HttpContext.Request.Host}{apiReferenceRelative}");

            var errors = new List<ValidationError>();
            if (validationFailures != null)
            {
                foreach (var validationFailure in validationFailures)
                {
                    var qualifiedPropertyName = validationFailure.PropertyName;
                    var segments = qualifiedPropertyName.Split('.');
                    var propertyName = segments.Last();
                    var message = validationFailure.ErrorMessage;
                    errors.Add(new ValidationError(field: propertyName, message: message));
                }
            }

            var errorResult = new ApiError()
            {
                HttpStatusCode   = (int)HttpStatusCode,
                ApiErrorCode    = (int)ApiErrorCode,
                DeveloperMessage = DeveloperMessage,
                ApiReference     = apiReferenceAbsolute,
                Errors           = errors,
            };

            var objectResult = new ObjectResult(errorResult)
            {
                StatusCode = (int)HttpStatusCode,
            };

            return objectResult;
        }
    }
}