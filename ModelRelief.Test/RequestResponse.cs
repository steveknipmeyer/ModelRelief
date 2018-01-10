// -----------------------------------------------------------------------
// <copyright file="RequestResponse.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test
{
    using System.Net.Http;

    /// <summary>
    /// Represents the result of a client request.
    /// </summary>
    public class RequestResponse
    {
        public HttpResponseMessage Message { get; set; }
        public string              ContentString { get; set; }
    }
}
