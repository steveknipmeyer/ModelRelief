// -----------------------------------------------------------------------
// <copyright file="RestControllerOptions.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
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