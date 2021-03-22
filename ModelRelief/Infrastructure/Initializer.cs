// -----------------------------------------------------------------------
// <copyright file="Initializer.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Database
{
    using System;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Features.Settings;

    public class Initializer
    {
        private ISettingsManager SettingsManager { get; set; }

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
            if (services == null)
                throw new ArgumentNullException(nameof(IServiceScope));

            SettingsManager = services.GetRequiredService<ISettingsManager>();
        }

        /// <summary>
        /// Initialization of backend (BE) shared settings that are defined through JSON.
        /// </summary>
        public async Task InitializeDefaultSettingsAsync()
        {
            dynamic defaultSettings = await SettingsManager.GetSettingsAsync(SettingsType.Default);
            DefaultSettings.Initialize(defaultSettings);
        }

        /// <summary>
        /// Performs general initialization.
        /// </summary>
        public void Initialize()
        {
            InitializeDefaultSettingsAsync().Wait();
        }
    }
}
