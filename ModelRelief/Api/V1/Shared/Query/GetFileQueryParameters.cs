// -----------------------------------------------------------------------
// <copyright file="GetFileQueryParameters.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    /// Represents GET query parameters.
    /// </summary>
    public class GetFileQueryParameters
    {
        /// <summary>
        /// Gets or sets the file extension parameter.
        /// </summary>
        public string Extension { get; set; }

        // use gzip compression
        public bool Compression { get; set; }
    }
}
