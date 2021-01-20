// -----------------------------------------------------------------------
// <copyright file="HttpHelpers.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Utility
{
    using Microsoft.AspNetCore.Http;

    public static class HttpHelpers
    {
        public static bool RequestIsLocal(HttpRequest request)
        {
            bool isLocal = request.Host.ToString().Contains("localhost", System.StringComparison.CurrentCultureIgnoreCase);
            return isLocal;
        }
    }
}