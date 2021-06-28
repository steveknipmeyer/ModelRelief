// -----------------------------------------------------------------------
// <copyright file="PostFormResponse.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Responses
{
    using System;
    using System.Collections.Generic;
    using Microsoft.AspNetCore.Mvc.ModelBinding;
    using ModelRelief.Api.V1.Shared.Errors;

    /// <summary>
    /// Represents the collection of PostForm errors returned in the response to the FE.
    /// </summary>
    public class PostFormResponse
    {
        public bool Success { get; set; }
        public string RedirectToUrl { get; set; }

        public string Name { get; set; }
        public string FileName { get; set; }
        public List<ValidationError> Errors { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="PostFormResponse"/> class.
        /// Constructor
        /// </summary>
        /// <param name="name">Model name.</param>
        /// <param name="fileName">Backing file.</param>
        public PostFormResponse(string name, string fileName)
        {
            Success = false;
            RedirectToUrl = string.Empty;

            Name = name;
            FileName = fileName;

            Errors = new List<ValidationError>();
        }

        /// <summary>
        /// Constructs the Errors list from a ModelState.
        /// </summary>
        /// <param name="modelState">View ModelState after request validation has been performed.</param>
        public void AddErrors(ModelStateDictionary modelState)
        {
            foreach (KeyValuePair<string, ModelStateEntry> keyValuePair in modelState)
            {
                string key = keyValuePair.Key;
                ModelStateEntry modelStateEntry = keyValuePair.Value;
                foreach (var error in modelStateEntry.Errors)
                {
                    Errors.Add(new ValidationError(key, error.ErrorMessage));
                }
            }
        }
    }
}
