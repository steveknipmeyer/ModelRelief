// -----------------------------------------------------------------------
// <copyright file="Errors.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Errors
{
    using System.Net;
    using Microsoft.AspNetCore.Diagnostics;
    using Microsoft.AspNetCore.Mvc;

    /// <summary>
    /// Represents the controller endpoint for error handling.
    /// Startup routes erorrs :
    ///     app.UseStatusCodePagesWithReExecute("/Errors/Error/{0}");
    /// </summary>
    public class Errors : Controller
    {
        /// <summary>
        /// Error page for a middleware HTTP status code such as 404.
        /// </summary>
        /// <remarks>This is used for middleware errors such as no endpoint NotFound (404).
        /// It is NOT used for an error code returned by the application such as BadRequest (400)</remarks>
        /// <param name="statusCode">Error code.</param>
        public IActionResult Error(int? statusCode)
        {
            statusCode = statusCode ?? 0;
            var feature = HttpContext.Features.Get<IStatusCodeReExecuteFeature>();

            string page = "Error";
            switch (statusCode)
            {
                case (int)HttpStatusCode.BadRequest:
                    page = "BadRequest";
                    break;

                case (int)HttpStatusCode.NotFound:
                    page = "NotFound";
                    break;

                case (int)HttpStatusCode.Unauthorized:
                    page = "NotAuthorized";
                    break;

                default:
                    page = "Error";
                    break;
            }
            ViewData["statusCode"] = statusCode;
            ViewData["originalPath"] = feature?.OriginalPath;
            ViewData["originalQueryString"] = feature?.OriginalQueryString;

            return View(page);
        }
    }
}
