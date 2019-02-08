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

    public class Initializer
    {
        private IServiceProvider Services { get; set; }
        private IHostingEnvironment HostingEnvironment { get; set; }
        private Services.IConfigurationProvider ConfigurationProvider { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Initializer"/> class.
        /// Constructor
        /// </summary>
        /// <param name="scope">Service scope provider.</param>
        public Initializer(IServiceScope scope)
        : this(scope.ServiceProvider)
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Initializer"/> class.
        /// Constructor
        /// </summary>
        /// <param name="services">Service provider.</param>
        public Initializer(IServiceProvider services)
        {
            Services = services;
            if (services == null)
                throw new ArgumentNullException(nameof(IServiceScope));
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

            var systemSettings = settingsManager.GetSettings(SettingsManager.SystemType) as SystemSettingsJson;
            SystemSettings.Initialize(systemSettings);
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
