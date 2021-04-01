// -----------------------------------------------------------------------
// <copyright file="Initializer.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Database
{
    using System;
    using System.Threading.Tasks;
    using Microsoft.Extensions.DependencyInjection;
    using ModelRelief.Domain;
    using ModelRelief.Features.Settings;

    public class Initializer : IInitializer
    {
        private ISettingsManager _settingsManager { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Initializer"/> class.
        /// Constructor
        /// </summary>
        /// <param name="settingsManager">ISettingsManager.</param>
        public Initializer(ISettingsManager settingsManager)
        {
            _settingsManager = settingsManager ?? throw new ArgumentNullException(nameof(settingsManager));
        }

        /// <summary>
        /// Initialization of backend (BE) shared settings that are defined through JSON.
        /// </summary>
        public async Task InitializeDefaultSettingsAsync()
        {
            dynamic defaultSettings = await _settingsManager.GetSettingsAsync(SettingsType.Default);
            Defaults.Initialize(defaultSettings);
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
