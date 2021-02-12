// -----------------------------------------------------------------------
// <copyright file="SettingsManager.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Settings
{
    using System.IO;
    using System.Security.Claims;
    using Microsoft.AspNetCore.Hosting;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Services;
    using ModelRelief.Utility;
    using Newtonsoft.Json;

    /// <summary>
    /// Shared settings manager.
    /// Provides initialization of settings shared between the front end (FE) and backend (BE) through JSON.
    /// </summary>
    public class SettingsManager : ISettingsManager
    {
        public const string CameraType = "camera";
        public const string UserType = "user";

        public  IWebHostEnvironment HostingEnvironment { get; set; }
        public  IConfigurationProvider ConfigurationProvider { get; set; }
        public  ModelReliefDbContext DbContext { get; set; }

        public Settings UserSettings { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="SettingsManager"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="hostingEnvironment">IWebHostEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="dbContext">ModelReliefDBContext</param>
        public SettingsManager(IWebHostEnvironment hostingEnvironment, Services.IConfigurationProvider configurationProvider, ModelReliefDbContext dbContext)
        {
            this.HostingEnvironment = hostingEnvironment;
            this.ConfigurationProvider = configurationProvider;

            this.UserSettings = new Settings();
        }

        /// <summary>
        /// Assign the user settings from the active user (if defined)
        /// </summary>
        /// <param name="user">Active user</param>
        public void InitializeUserSettingsFromUser(ClaimsPrincipal user)
        {
            var applicationUser = IdentityUtility.FindApplicationUserAsync(user).GetAwaiter().GetResult();
        }

        /// <summary>
        /// Return the default settings object for the given settings type.
        /// </summary>
        /// <param name="settingsType">Settings type (e.g. camera)</param>
        /// <returns>Settings object read from JSON.</returns>
        public object GetSettings(string settingsType)
        {
            switch (settingsType.ToLower())
            {
                case CameraType:
                    var rootSettingsFile = $"{Strings.Captitalize(settingsType)}Settings.json";
                    var settingsFile = $"{this.HostingEnvironment.ContentRootPath}{ConfigurationProvider.GetSetting(Paths.Settings)}/{rootSettingsFile}";
                    settingsFile = Path.GetFullPath(settingsFile);

                    var defaultCameraSettings = JsonConvert.DeserializeObject<DefaultCameraSettingsJson>(System.IO.File.ReadAllText(settingsFile));
                    return defaultCameraSettings;

                case UserType:
                    return this.UserSettings;

                default:
                    return null;
            }
        }
    }
}
