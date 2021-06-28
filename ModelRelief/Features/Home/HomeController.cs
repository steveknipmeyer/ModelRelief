// -----------------------------------------------------------------------
// <copyright file="HomeController.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Home
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;
    using ModelRelief.Settings;
    using ModelRelief.Utility;

    public class HomeController : Controller
        {
        private readonly ReCAPTCHASettings _reCAPTCHASettings;

        /// <summary>
        /// Initializes a new instance of the <see cref="HomeController"/> class.
        /// </summary>
        /// <param name="reCAPTCHASettings">reCAPTCHA settings from a configuration store (Azure key vault).</param>
        public HomeController(IOptions<ReCAPTCHASettings> reCAPTCHASettings)
        {
            _reCAPTCHASettings = reCAPTCHASettings.Value as ReCAPTCHASettings;
        }

        /// <summary>
        /// Action method for Home page.
        /// </summary>
        [HttpGet]
        public IActionResult Index()
            {
            var siteKey = HttpHelpers.RequestIsLocal(this.Request) ? _reCAPTCHASettings.localhostModelRelief.Site : _reCAPTCHASettings.ModelRelief.Site;
            ViewData["ReCaptchaKey"] = siteKey;

            return View();
            }

        /// <summary>
        /// Action method for settings.
        /// </summary>
        [HttpGet]
        public IActionResult About()
        {
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
        /// Action method for Cookie Policy page.
        /// </summary>
        [HttpGet]
        public IActionResult CookiePolicy()
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

        /// <summary>
        /// Action method for route testing.
        /// </summary>
        /// <param name="id">Placeholder.</param>
        [HttpGet]
        public IActionResult Special(int id)
        {
            return Content($"Id = {id}");
        }
    }
}
