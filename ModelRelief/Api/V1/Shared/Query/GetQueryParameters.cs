// -----------------------------------------------------------------------
// <copyright file="GetQueryParameters.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using ModelRelief.Domain;

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
