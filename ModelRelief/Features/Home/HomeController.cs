// -----------------------------------------------------------------------
// <copyright file="HomeController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Home
{
    using System;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;
    using ModelRelief.Settings;
    using ModelRelief.Utility;
    using ModelRelief.Workbench;

    public class HomeController : Controller
        {
        private readonly IFunctionTwo<double> _function;
        private readonly ReCAPTCHASettings _reCAPTCHASettings;

        /// <summary>
        /// Initializes a new instance of the <see cref="HomeController"/> class.
        /// </summary>
        /// <param name="function">DI test object.</param>
        /// <param name="reCAPTCHASettings">reCAPTCHA settings from a configuration store (Azure key vault).</param>
        public HomeController(IFunctionTwo<double> function, IOptions<ReCAPTCHASettings> reCAPTCHASettings)
        {
            _reCAPTCHASettings = reCAPTCHASettings.Value as ReCAPTCHASettings;
            this._function = function;
            Console.WriteLine(function.F2(1.0, 2.0));
        }

        /// <summary>
        /// Action method for Home page.
        /// </summary>
        public IActionResult Index()
            {
            var siteKey = HttpHelpers.RequestIsLocal(this.Request) ? _reCAPTCHASettings.localhostModelRelief.Site : _reCAPTCHASettings.ModelRelief.Site;
            ViewData["ReCaptchaKey"] = siteKey;

            return View();
            }

        /// <summary>
        /// Action method for Privacy page.
        /// </summary>
        [HttpGet]
        public IActionResult Privacy()
        {
            return View();
        }

        /// <summary>
        /// Action method for Credits page.
        /// </summary>
        [HttpGet]
        public IActionResult Credits()
        {
            return View();
        }
    }
}
