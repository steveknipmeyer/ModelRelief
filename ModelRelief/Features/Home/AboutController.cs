// -----------------------------------------------------------------------
// <copyright file="AboutController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Home
{
    using System.Net;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc;
    using ModelRelief.Services;

    public class AboutController : Controller
        {
        private IWebHostEnvironment HostingEnvironment { get; }
        private Services.IConfigurationProvider ConfigurationProvider { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="AboutController"/> class.
        /// </summary>
        /// <param name="hostingEnvironment">IWebHostEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        public AboutController(IWebHostEnvironment hostingEnvironment, Services.IConfigurationProvider configurationProvider)
        {
            HostingEnvironment = hostingEnvironment ?? throw new System.ArgumentNullException(nameof(hostingEnvironment));
            ConfigurationProvider = configurationProvider ?? throw new System.ArgumentNullException(nameof(configurationProvider));
        }

        /// <summary>
        /// Action method for configuration.
        /// </summary>
        public ContentResult Configuration()
        {
            return new ContentResult
                {
                ContentType = "text/html",
                StatusCode = (int)HttpStatusCode.OK,
                Content = $"Environment = {HostingEnvironment.EnvironmentName}<br>" +
                $"ASPNETCORE_URLS = {ConfigurationProvider.GetSetting(ConfigurationSettings.URLS)}<br>" +
                $"ASPNETCORE_ANCM_HTTPS_PORT = {ConfigurationProvider.GetSetting(ConfigurationSettings.HTTPSPORT)}",
                };
        }

        /// <summary>
        /// Action method for route testing.
        /// </summary>
        [Route("special/{id?}")]
        [HttpGet]
        public IActionResult Description()
        {
            return Content("ModelRelief is a powerful tool to create a bas-relief (sculptural low relief) from a 3D model.");
        }
    }
}
