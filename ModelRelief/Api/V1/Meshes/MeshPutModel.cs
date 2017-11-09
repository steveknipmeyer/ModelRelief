// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Domain;
using ModelRelief.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace ModelRelief.Api.V1.Meshes
{
    /// <summary>
    /// Mesh PUT request.
    /// </summary>
    public class MeshPutModel : IValidatable<Mesh>
    {
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }

        /// <summary>
        /// Validates the model properties.
        /// </summary>
        /// <param name="modelState">ModelState</param>
        /// <returns>true if valid</returns>
        public bool Validate(ApplicationUser user, ApiController<Mesh> controller, int? id = null)
        {
            var results = new List<ValidationResult>();

            // verify target model exists (and is owned by user)
            IEnumerable<Mesh> meshes = controller.ModelProvider.GetAll().Where(mesh => ((mesh.Id == id) && (mesh.User.Id == user.Id)));
            if (meshes.Count() != 1)
                controller.ModelState.AddModelError(nameof(MeshPutModel), $"The mesh model (id = {id ?? 0}) does not exist.");

            if (String.IsNullOrEmpty(Name))
                controller.ModelState.AddModelError(nameof(Name), "A mesh name cannot be empty.");
#if false
            if (String.IsNullOrEmpty(Description))
                controller.modelState.AddModelError(nameof(Description), "A mesh description cannot be empty.");
#endif            
            return controller.ModelState.IsValid;
        }

        /// <summary>
        /// Formats a JSON object containing the extended error result.
        /// </summary>
        /// <param name="controller">Active controller</param>
        /// <returns>Api JSON result</returns>
        public ObjectResult ErrorResult (Controller controller,
            int httpStatusCode       = StatusCodes.Status400BadRequest,
            int apiStatusCode        = (int) ApiStatusCode.MeshPutValidationError,
            string developerMessage  = "The Mesh PUT properties are invalid."
            )
        {
            var objectResult = new ApiValidationResult(controller, httpStatusCode, apiStatusCode, developerMessage).ObjectResult();
            return objectResult;
        }
    }
}
