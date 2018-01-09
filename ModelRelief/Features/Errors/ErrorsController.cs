// -----------------------------------------------------------------------
// <copyright file="ErrorsController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Errors
{
    using System.Net;
    using Microsoft.AspNetCore.Mvc;

    public class Errors : Controller
    {
        /// <summary>
        /// Error page for a middleware HTTP status code such as 404.
        /// </summary>
        /// <remarks>This is used for middleware errors such as no endpoint NotFound (404).
        /// It is NOT used for an error code returned by the application such as BadRequest (400)</remarks>
        /// <param name="errorCode">Error code.</param>
        /// <returns></returns>
        public IActionResult Error(int errorCode)
        {
            string page = "Error";
            switch (errorCode)
            {
                case (int)HttpStatusCode.BadRequest:
                    page = "BadRequest";
                    break;

                case (int)HttpStatusCode.NotFound:
                    page = "NotFound";
                    break;
            }
            ViewData["statusCode"] = errorCode;
            return View(page);
        }
    }
}
