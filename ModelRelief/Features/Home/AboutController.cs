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
        private IHostingEnvironment HostingEnvironment { get; }
        private Services.IConfigurationProvider ConfigurationProvider { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="AboutController"/> class.
        /// </summary>
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        public AboutController(IHostingEnvironment hostingEnvironment, Services.IConfigurationProvider configurationProvider)
        {
            HostingEnvironment = hostingEnvironment ?? throw new System.ArgumentNullException(nameof(hostingEnvironment));
            ConfigurationProvider = configurationProvider ?? throw new System.ArgumentNullException(nameof(configurationProvider));
        }

        public ContentResult Configuration()
        {
            return new ContentResult
                {
                ContentType = "text/html",
                StatusCode = (int)HttpStatusCode.OK,
                Content = $"Environment = {HostingEnvironment.EnvironmentName}<br>" +
                $"ASPNETCORE_URLS = {ConfigurationProvider.GetSetting(ConfigurationSettings.URLS)}<br>" +
                $"ASPNETCORE_HTTPS_PORT = {ConfigurationProvider.GetSetting(ConfigurationSettings.HTTPSPORT)}",
                };
        }

        [Route("special/{id?}")]
        public IActionResult Phone()
        {
            return Content("571 730 7138");
        }
    }
}
