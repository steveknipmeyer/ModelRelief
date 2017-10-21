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
using System.Net;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Filters;

using ModelRelief.Infrastructure;
using ModelRelief.Models;

using Newtonsoft.Json;

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

    // http://www.jerriepelser.com/blog/validation-response-aspnet-core-webapi/
    public class ValidateMeshPutModelAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (context.ModelState.IsValid)
                return;

            var httpStatusCode       = StatusCodes.Status400BadRequest;
            var apiStatusCode        = (int) ApiStatusCode.MeshPutValidationError;
            string developerMessage  = "The Mesh PUT properties are invalid.";

            var contentResult = new ApiValidationResult(context, httpStatusCode, apiStatusCode, developerMessage).ContentResult();

            context.HttpContext.Response.StatusCode = httpStatusCode;
            context.Result = contentResult;
        }
    }
}
