// -----------------------------------------------------------------------
// <copyright file="PostFileQueryParameters.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    /// Represents POST File query parameters.
    /// </summary>
    public class PostFileQueryParameters
    {
        // use gzip compression
        public bool Compression { get; set; }
    }
}
