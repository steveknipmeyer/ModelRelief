// -----------------------------------------------------------------------
// <copyright file="SettingsController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Home
{
    using System;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Features.Settings;
    using Newtonsoft.Json;

    public class SettingsController : Controller
    {
        public ILogger Logger { get; }
        public IHostingEnvironment HostingEnvironment { get; }
        public Services.IConfigurationProvider ConfigurationProvider { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="SettingsController"/> class.
        /// Constructor
        /// </summary>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="hostingEnvironment">IHostingEnvironment</param>
        /// <param name="configurationProvider">IConfigurationProvider</param>
        public SettingsController(ILoggerFactory loggerFactory, IHostingEnvironment hostingEnvironment, Services.IConfigurationProvider configurationProvider)
        {
            Logger = (loggerFactory == null) ? throw new System.ArgumentNullException(nameof(loggerFactory)) : loggerFactory.CreateLogger<SettingsController>();
            HostingEnvironment = hostingEnvironment ?? throw new System.ArgumentNullException(nameof(hostingEnvironment));
            ConfigurationProvider = configurationProvider ?? throw new System.ArgumentNullException(nameof(configurationProvider));
        }

        [Route("settings/{settingsFile}")]
        public async Task<ContentResult> GetFile([FromRoute]string settingsFile)
        {
            await Task.CompletedTask;

            var cameraSettingsFile = @"D:\ModelRelief\ModelRelief\Settings\DefaultCameraSettings.json";
            DefaultCameraSettings defaultCameraSettings = JsonConvert.DeserializeObject<DefaultCameraSettings>(System.IO.File.ReadAllText(cameraSettingsFile));

            var serializedContent = JsonConvert.SerializeObject(defaultCameraSettings, new JsonSerializerSettings
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
