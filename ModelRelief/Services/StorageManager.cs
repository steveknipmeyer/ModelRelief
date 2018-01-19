// -----------------------------------------------------------------------
// <copyright file="StorageManager.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services
{
    using System.IO;
    using Microsoft.AspNetCore.Hosting;
    using ModelRelief.Domain;

    /// <summary>
    /// User storage manager.
    /// Provides file services for file-based resources.
    /// </summary>
    public class StorageManager : IStorageManager
    {
        public IHostingEnvironment HostingEnvironment { get; }
        public IConfigurationProvider ConfigurationProvider { get; }

        public StorageManager(IHostingEnvironment hostingEnvironment, Services.IConfigurationProvider  configurationProvider)
        {
            HostingEnvironment = hostingEnvironment;
            ConfigurationProvider = configurationProvider;
        }

        /// <summary>
        /// Returns the default model storage folder for a given model instance.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="model">Model instance. </param>
        /// <returns></returns>
        public string DefaultModelStorageFolder<TEntity>(TEntity model)
            where TEntity : DomainModel
        {
            var storeUsersFolder  = ConfigurationProvider.GetSetting(Paths.StoreUsers);
            var modelRootFolder = ConfigurationProvider.GetSetting($"Paths:ResourceFolders:{typeof(TEntity).Name}");

            string modelStorageFolder = $"{HostingEnvironment.WebRootPath}{storeUsersFolder}{model.User.Id}/{modelRootFolder}/{model.Id}/";

            // normalize
            return Path.GetFullPath(modelStorageFolder);
        }

        /// <summary>
        /// Returns the working storage folder for a given user.
        /// </summary>
        /// <param name="userId">User ID. </param>
        public string WorkingStorageFolder(string userId)
        {
            var storeUsersFolder = ConfigurationProvider.GetSetting(Paths.StoreUsers);
            var workingFolder = ConfigurationProvider.GetSetting(Paths.Working);

            string workingStorageFolder = $"{HostingEnvironment.WebRootPath}{storeUsersFolder}{userId}/{workingFolder}/";

            // normalize
            return Path.GetFullPath(workingStorageFolder);
        }
    }
}
