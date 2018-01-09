// -----------------------------------------------------------------------
// <copyright file="RestControllerOptions.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared
{
    /// <summary>
    /// Represents the options for an instance of a RestController.
    /// </summary>
    public class RestControllerOptions
    {
        /// <summary>
        /// Gets or sets a value indicating whether to page a collection of results.
        /// </summary>
        public bool UsePaging { get; set; }
    }
}