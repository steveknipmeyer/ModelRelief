// -----------------------------------------------------------------------
// <copyright file="PostFileQueryParameters.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    /// Represents POST query parameters.
    /// </summary>
    public class PostFileQueryParameters
    {
        // use gzip compression
        public bool Compression { get; set; }
    }
}
