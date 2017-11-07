// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Api.V1;
using ModelRelief.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace ModelRelief.Domain
{
    /// <summary>
    /// DepthBuffer PUT request.
    /// </summary>
    public class DepthBufferPutModel : IValidatable<DepthBuffer>
    {
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }

        /// <summary>
        /// Validates the model properties.
        /// </summary>
        /// <param name="modelState">ModelState</param>
        /// <returns>true if valid</returns>
        public bool Validate(ApplicationUser user, ApiController<DepthBuffer> controller, int? id = null)
        {
            var results = new List<ValidationResult>();
            
            // verify target model exists (and is owned by user)
            IEnumerable<DepthBuffer> depthBuffers = controller.ModelProvider.GetAll().Where(depthBuffer => ((depthBuffer.Id == id) && (depthBuffer.User.Id == user.Id)));
            if (depthBuffers.Count() != 1)
                controller.ModelState.AddModelError(nameof(DepthBufferPutModel), $"The DepthBuffer model (id = {id ?? 0}) does not exist.");

            if (String.IsNullOrEmpty(Name))
                controller.ModelState.AddModelError(nameof(Name), "A depth buffer name cannot be empty.");
#if false
            if (String.IsNullOrEmpty(Description))
                modelState.AddModelError(nameof(Description), "A DepthBuffer description cannot be empty.");
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
            int apiStatusCode        = (int) ApiStatusCode.DepthBufferPutValidationError,
            string developerMessage  = "The DepthBuffer PUT properties are invalid."
            )
        {
            var objectResult = new ApiValidationResult(controller, httpStatusCode, apiStatusCode, developerMessage).ObjectResult();
            return objectResult;
        }
    }
}
