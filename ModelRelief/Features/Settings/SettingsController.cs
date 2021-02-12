// -----------------------------------------------------------------------
// <copyright file="SettingsController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Settings
{
    using System.Net;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Services;
    using Newtonsoft.Json;

    public class SettingsController : Controller
    {
        public ILogger Logger { get; }
        public IWebHostEnvironment HostingEnvironment { get; }
        public Services.IConfigurationProvider ConfigurationProvider { get; }
        public ISettingsManager SettingsManager { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="SettingsController"/> class.
        /// Constructor
        /// </summary>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="hostingEnvironment">IWebHostEnvironment</param>
        /// <param name="configurationProvider">IConfigurationProvider</param>
        /// <param name="settingsManager">ISettingsManager</param>
        public SettingsController(ILoggerFactory loggerFactory, IWebHostEnvironment hostingEnvironment, Services.IConfigurationProvider configurationProvider, ISettingsManager settingsManager)
        {
            Logger = (loggerFactory == null) ? throw new System.ArgumentNullException(nameof(loggerFactory)) : loggerFactory.CreateLogger<SettingsController>();
            HostingEnvironment = hostingEnvironment ?? throw new System.ArgumentNullException(nameof(hostingEnvironment));
            ConfigurationProvider = configurationProvider ?? throw new System.ArgumentNullException(nameof(configurationProvider));
            SettingsManager = settingsManager ?? throw new System.ArgumentNullException(nameof(settingsManager));
        }

        /// <summary>
        /// Action method for settings.
        /// </summary>
        [Route("settings")]
        [HttpGet]
        public IActionResult Editor()
        {
            ViewBag.Environment = HostingEnvironment.EnvironmentName;
            ViewBag.ASPNETCORE_URLS = ConfigurationProvider.GetSetting(ConfigurationSettings.URLS);

            return View();
        }

        /// <summary>
        /// Returns the JSON settings file by category (e.g. camera).
        /// </summary>
        /// <param name="settingsType">JSON settings file type (e.g. camera).</param>
        /// <returns>JSON settings file.</returns>
        [Route("settings/type/{settingsType}")]
        [HttpGet]
        public ContentResult GetSettingsByType([FromRoute]string settingsType)
        {
            var settingsObject = this.SettingsManager.GetSettings(settingsType);
            var serializedContent = JsonConvert.SerializeObject(settingsObject, new JsonSerializerSettings
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                });

            return new ContentResult
            {
                ContentType = "application/json",
                Content = serializedContent,
            };
        }
    }
}
