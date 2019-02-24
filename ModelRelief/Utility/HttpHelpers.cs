// -----------------------------------------------------------------------
// <copyright file="HttpHelpers.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Utility
{
    using System.Security.Claims;
    using System.Security.Principal;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;
    using ModelRelief.Api.V1.Shared.Errors;
    using ModelRelief.Domain;

    public static class HttpHelpers
    {
        public static bool RequestIsLocal(HttpRequest request)
        {
            bool isLocal = request.Host.ToString().Contains("localhost", System.StringComparison.CurrentCultureIgnoreCase);
            return isLocal;
        }
    }
}