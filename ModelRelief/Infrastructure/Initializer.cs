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
    using ModelRelief.Services;

    public class Initializer : IInitializer
    {
        private ISettingsManager _settingsManager { get; set; }
        private IStorageManager _storageManager { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Initializer"/> class.
        /// Constructor
        /// </summary>
        /// <param name="settingsManager">ISettingsManager.</param>
        /// <param name="storageManager">IStorageManager.</param>
        public Initializer(ISettingsManager settingsManager, IStorageManager storageManager)
        {
            _settingsManager = settingsManager ?? throw new ArgumentNullException(nameof(settingsManager));
            _storageManager = storageManager ?? throw new ArgumentNullException(nameof(storageManager));
        }

        /// <summary>
        /// Performs general initialization.
        /// </summary>
        public void Initialize()
        {
            InitializeDefaultSettingsAsync().Wait();
            InitializeServicesRepository();
        }

        /// <summary>
        /// Initialization of backend (BE) shared settings that are defined through JSON.
        /// </summary>
        private async Task InitializeDefaultSettingsAsync()
        {
            dynamic defaultSettings = await _settingsManager.GetSettingsAsync(SettingsType.Default);
            Defaults.Initialize(defaultSettings);
        }

        /// <summary>
        /// Initiailize repository of services for contexts without DI (e.g. FileDomainModel)
        /// </summary>
        private void InitializeServicesRepository()
        {
            ServicesRepository.StorageManager = _storageManager;
        }
    }
}
