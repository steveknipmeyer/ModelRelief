// -----------------------------------------------------------------------
// <copyright file="ValidationError.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Errors
{
    using Newtonsoft.Json;

    /// <summary>
    /// Helper class to construct a ModelState ValidationError.
    /// </summary>
    public class ValidationError
    {
        /// <summary>
        /// Gets the model field for the error.
        /// </summary>
        [JsonProperty(NullValueHandling=NullValueHandling.Ignore)]
        public string Field { get; }

        /// <summary>
        /// Gets the error message for the model field.
        /// </summary>
        public string Message { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ValidationError"/> class.
        /// Constructor
        /// </summary>
        /// <param name="field">Model field for which the error was generated.</param>
        /// <param name="message">Error message.</param>
        public ValidationError(string field, string message)
        {
            Field = (field != string.Empty) ? field : null;
            Message = message;
        }
    }
}