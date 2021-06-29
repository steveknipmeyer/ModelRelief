// -----------------------------------------------------------------------
// <copyright file="HomeController.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Home
{
    using System.Collections.Generic;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;
    using ModelRelief.Dto;
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

            var exampleCards = BuildExampleCards();
            return View(exampleCards);
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

        /// <summary>
        /// Builds the collection of example models shown in the card grid.
        /// </summary>
        private List<ExampleCard> BuildExampleCards()
        {
            var exampleCards = new List<ExampleCard>
            {
                new ExampleCard { Name = "lucy", Title = "Lucy" },
                new ExampleCard { Name = "scallop", Title = "Scallop Shell" },
                new ExampleCard { Name = "horse", Title = "Prancing Horse" },
                new ExampleCard { Name = "dragon", Title = "Chinese Dragon" },
                new ExampleCard { Name = "plunderbusspete", Title = "Plunderbuss Pete" },
                new ExampleCard { Name = "house", Title = "San Francisco House" },
            };
            return exampleCards;
        }
    }
}
