// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using ModelRelief.Infrastructure;
using ModelRelief.Services;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

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
    /// Mesh POST request.
    /// </summary>
    public class MeshPostRequest 
    {
        public byte[] Raw { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="raw">Byte array from the request body</param>
        public MeshPostRequest (byte[] raw)
        {
            Raw = raw;
        }

        /// <summary>
        /// Validates the file properties.
        /// </summary>
        /// <param name="modelState">ModelState</param>
        /// <returns>true if valid</returns>
        public bool Validate(User user, IResourcesProvider resourceProvider, ModelStateDictionary modelState, int? id = null)
        {
            var results = new List<ValidationResult>();

            return modelState.IsValid;
        }

        /// <summary>
        /// Formats a JSON object containing the extended error result.
        /// </summary>
        /// <param name="context">Current HttpContext</param>
        /// <param name="controller">Active controller</param>
        /// <returns>Api JSON result</returns>
        public ObjectResult ErrorResult (HttpContext context, Controller controller)
        {
            var httpStatusCode       = StatusCodes.Status400BadRequest;
            var apiStatusCode        = (int) ApiStatusCode.MeshPostValidationError;
            string developerMessage  = "The Mesh POST properties are invalid.";

            var objectResult = new ApiValidationResult(context, controller, httpStatusCode, apiStatusCode, developerMessage).ObjectResult();
            return objectResult;
        }
    }

    /// <summary>
    /// Mesh PUT request.
    /// </summary>
    public class MeshPutRequest
    {
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }

        /// <summary>
        /// Validates the model properties.
        /// </summary>
        /// <param name="modelState">ModelState</param>
        /// <returns>true if valid</returns>
        public bool Validate(User user, IResourcesProvider resourceProvider, ModelStateDictionary modelState, int? id = null)
        {
            var results = new List<ValidationResult>();
            
            // verify target resource exists (and is owned by user)
            IEnumerable<Mesh> meshes = resourceProvider.Meshes.DbSet.Where(mesh => ((mesh.Id == id) && (mesh.User.Id == user.Id)));
            if (meshes.Count() != 1)
                modelState.AddModelError(nameof(MeshPutRequest), $"The mesh resource (id = {id ?? 0}) does not exist.");

#if false
            if (String.IsNullOrEmpty(Description))
                modelState.AddModelError(nameof(Description), "A mesh description cannot be empty.");
#endif            
            return modelState.IsValid;
        }

        /// <summary>
        /// Formats a JSON object containing the extended error result.
        /// </summary>
        /// <param name="context">Current HttpContext</param>
        /// <param name="controller">Active controller</param>
        /// <returns>Api JSON result</returns>
        public ObjectResult ErrorResult (HttpContext context, Controller controller)
        {
            var httpStatusCode       = StatusCodes.Status400BadRequest;
            var apiStatusCode        = (int) ApiStatusCode.MeshPutValidationError;
            string developerMessage  = "The Mesh PUT properties are invalid.";

            var objectResult = new ApiValidationResult(context, controller, httpStatusCode, apiStatusCode, developerMessage).ObjectResult();
            return objectResult;
        }
    }
}
