﻿// -----------------------------------------------------------------------
// <copyright file="SettingsManager.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Settings
{
    using System.IO;
    using Microsoft.AspNetCore.Hosting;
    using ModelRelief.Services;
    using ModelRelief.Utility;
    using Newtonsoft.Json;

    /// <summary>
    /// Shared settings manager.
    /// Provides initialization of settings shared between the front end (FE) and backend (BE) through JSON.
    /// </summary>
    public class SettingsManager
    {
        public const string CameraType = "camera";
        public const string SystemType = "system";

        public IHostingEnvironment HostingEnvironment { get; }
        public IConfigurationProvider ConfigurationProvider { get; }

        public SettingsManager(IHostingEnvironment hostingEnvironment, Services.IConfigurationProvider configurationProvider)
        {
            HostingEnvironment = hostingEnvironment;
            ConfigurationProvider = configurationProvider;
        }

        /// <summary>
        /// Return the default settings object for the given settings type.
        /// </summary>
        /// <param name="settingsType">Settings type (e.g. camera)</param>
        /// <returns>Settings object read from JSON.</returns>
        public object GetSettings(string settingsType)
        {
            var rootSettingsFile = $"{Strings.Captitalize(settingsType)}Settings.json";
            var settingsFile = $"{HostingEnvironment.ContentRootPath}{ConfigurationProvider.GetSetting(Paths.Settings)}/{rootSettingsFile}";
            settingsFile = Path.GetFullPath(settingsFile);

            switch (settingsType.ToLower())
            {
                case CameraType:
                    var defaultCameraSettings = JsonConvert.DeserializeObject<DefaultCameraSettingsJson>(System.IO.File.ReadAllText(settingsFile));
                    return defaultCameraSettings;

                case SystemType:
                    var systemSettings = JsonConvert.DeserializeObject<SystemSettingsJson>(System.IO.File.ReadAllText(settingsFile));
                    return systemSettings;

                default:
                    return null;
            }
        }
    }
}
