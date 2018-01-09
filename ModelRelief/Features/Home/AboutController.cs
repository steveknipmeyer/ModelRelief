// -----------------------------------------------------------------------
// <copyright file="AboutController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Home
{
    using Microsoft.AspNetCore.Mvc;

    public class AboutController : Controller
        {
        public IActionResult Phone()
            {
            return Content("571 730 7138");
            }

        [Route("special/{id?}")]
        public IActionResult Company()
            {
            return Content("ModelRelief, LLC");
            }
        }
    }
