// -----------------------------------------------------------------------
// <copyright file="SettingsController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Home
{
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Features.Settings;
    using ModelRelief.Services;
    using ModelRelief.Utility;
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

        /// <summary>
        /// Return the default settings object for the given settings type.
        /// </summary>
        /// <param name="settingsType">Settings type (e.g. camera)</param>
        /// <param name="hostingEnvironment">IHostingEnvironment</param>
        /// <param name="configurationProvider">IConfigurationProvider</param>
        /// <returns>Settings object read from JSON.</returns>
        public static object GetSettings(string settingsType, IHostingEnvironment hostingEnvironment, Services.IConfigurationProvider configurationProvider)
        {
            var rootSettingsFile = $"Default{Strings.Captitalize(settingsType)}Settings.json";
            var settingsFile = $"{hostingEnvironment.ContentRootPath}{configurationProvider.GetSetting(Paths.Settings)}/{rootSettingsFile}";
            settingsFile = Path.GetFullPath(settingsFile);

            switch (settingsType.ToLower())
            {
                case "camera":
                    DefaultCameraSettings defaultCameraSettings = JsonConvert.DeserializeObject<DefaultCameraSettings>(System.IO.File.ReadAllText(settingsFile));
                    return defaultCameraSettings;

                default:
                    return null;
            }
        }

        /// <summary>
        /// Returns the JSON settings file by category (e.g. camera).
        /// </summary>
        /// <param name="settingsType">JSON settings file type (e.g. camera).</param>
        /// <returns>JSON settings file.</returns>
        [Route("settings/{settingsType}")]
        public ContentResult GetFile([FromRoute]string settingsType)
        {
            var settingsObject = SettingsController.GetSettings(settingsType, HostingEnvironment, ConfigurationProvider);
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
