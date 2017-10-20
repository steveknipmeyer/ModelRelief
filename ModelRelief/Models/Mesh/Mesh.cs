// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

using ModelRelief.Models;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

using Newtonsoft.Json;
using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace ModelRelief.Models
    {
    public enum MeshFormat
        {
        None,           // unknown
        OBJ,            // Wavefront OBJ
        STL             // Stereolithography
        }

    public class Mesh  : ModelReliefEntity
    {
        [Required, Display (Name = "Mesh Name")]
        public string Name { get; set; }
        public string Description { get; set; }

        public MeshFormat Format { get; set; }      
        public string Path { get; set; }

        // Navigation Properties
        public User User { get; set; }
        public Project Project { get; set; }
        public DepthBuffer DepthBuffer { get; set; }
        public MeshTransform MeshTransform { get; set; }

        public Camera Camera { get; set; }

        public Mesh()
        {
        }
    }

    /// <summary>
    /// Mesh PUT request.
    /// </summary>
    public class MeshPutRequest : IValidatableObject
    {
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public string PropertyPrime { get; set; }

        /// <summary>
        /// Validates the model properties.
        /// </summary>
        /// <param name="validationContext">Validation context.</param>
        /// <returns>Collection of ValidationResults</returns>
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var results = new List<ValidationResult>();

            if (String.IsNullOrEmpty(Description))
            {
                yield return new ValidationResult("A mesh description cannot be empty.", new[] { nameof(Description) });
            }

            if (String.IsNullOrEmpty(PropertyPrime))
            {
                yield return new ValidationResult("A custom error message for PropertyPrime.", new[] { "PropertyPrime" });
            }
        }
    }

    public enum ApiStatusCode
    {
        MeshPutValidationError = 1000
    }

    public class ValidationError
    {
        [JsonProperty(NullValueHandling=NullValueHandling.Ignore)]
        public string Field { get; }

        public string Message { get; }

        public ValidationError(string field, string message)
        {
            Field = field != string.Empty ? field : null;
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

            string apiReferenceRelative = ((Controller) _context.Controller).Url.RouteUrl("ApiDocumentation", new {id = _apiStatusCode});
            var apiReferenceAbsolute    = string.Format("{0}://{1}{2}", _context.HttpContext.Request.Scheme, _context.HttpContext.Request.Host, apiReferenceRelative);

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

    // http://www.jerriepelser.com/blog/validation-response-aspnet-core-webapi/
    public class ValidateMeshPutModelAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (context.ModelState.IsValid)
                return;

            var httpStatusCode       = StatusCodes.Status422UnprocessableEntity;
            var apiStatusCode        = (int) ApiStatusCode.MeshPutValidationError;
            string developerMessage  = "The Mesh PUT properties are invalid.";

            var result = new ApiValidationResult(context, httpStatusCode, apiStatusCode, developerMessage).ContentResult();

            context.HttpContext.Response.StatusCode = httpStatusCode;
            context.Result = result;
        }
    }
}
