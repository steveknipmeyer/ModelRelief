// -----------------------------------------------------------------------
// <copyright file="Initializer.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Database
{
    using System;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.DependencyInjection;
    using ModelRelief.Features.Settings;
    using static ModelRelief.Services.StorageManager;

    public class Initializer
    {
        private IServiceProvider Services { get; set; }
        private IHostingEnvironment HostingEnvironment { get; set; }
        private Services.IConfigurationProvider ConfigurationProvider { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Initializer"/> class.
        /// Constructor
        /// </summary>
        /// <param name="services">Service provider.</param>
        public Initializer(IServiceProvider services)
        {
            Services = services ?? throw new ArgumentNullException(nameof(services));

            HostingEnvironment = Services.GetRequiredService<IHostingEnvironment>();
            if (HostingEnvironment == null)
                throw new ArgumentNullException(nameof(HostingEnvironment));

            ConfigurationProvider = services.GetRequiredService<Services.IConfigurationProvider>();
            if (ConfigurationProvider == null)
                throw new ArgumentNullException(nameof(ConfigurationProvider));
        }

        /// <summary>
        /// Initialization of backend (BE) shared settings that are defined through JSON.
        /// </summary>
        public void InitializeSharedSettings()
        {
            var settingsManager = new SettingsManager(HostingEnvironment, ConfigurationProvider);

            var defaultCameraSettings = settingsManager.GetSettings(SettingsManager.CameraType) as DefaultCameraSettingsJson;
            DefaultCameraSettings.Initialize(defaultCameraSettings);
        }

        /// <summary>
        /// Performs general initialization.
        /// </summary>
        public void Initialize()
        {
            InitializeSharedSettings();
        }
    }
}
