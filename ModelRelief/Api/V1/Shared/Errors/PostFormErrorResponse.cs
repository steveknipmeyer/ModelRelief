// -----------------------------------------------------------------------
// <copyright file="PostFormErrorResponse.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Errors
{
    using System.Collections.Generic;
    using Microsoft.AspNetCore.Mvc.ModelBinding;

    /// <summary>
    /// Represents the collection of PostForm errors returned in the response to the FE.
    /// </summary>
    public class PostFormErrorResponse
    {
        public string Name { get; set; }
        public string FileName { get; set; }
        public List<ValidationError> Errors { get; set; }
        /// <summary>
        /// Initializes a new instance of the <see cref="PostFormErrorResponse"/> class.
        /// Constructor
        /// </summary>
        /// <param name="name">Model name.</param>
        /// <param name="fileName">Backing file.</param>
        /// <param name="modelState">View ModelState after request validation has been performed.</param>
        public PostFormErrorResponse(string name, string fileName, ModelStateDictionary modelState)
        {
            Name = name;
            FileName = fileName;

            Errors = new List<ValidationError>();
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
