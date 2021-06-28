// -----------------------------------------------------------------------
// <copyright file="GetQueryParameters.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    /// Represents GET query parameters.
    /// </summary>
    public class GetQueryParameters
    {
        /// <summary>
        /// Gets or sets a model Name query parameter.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the Relations parameter for returning relationship collections.
        /// </summary>
        public string Relations { get; set; }
    }
}
