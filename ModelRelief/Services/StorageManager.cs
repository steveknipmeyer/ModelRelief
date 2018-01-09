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
    /// User storage manager interface.
    /// Provides file services for file-based resources.
    /// </summary>
    public interface IStorageManager
    {
        IConfigurationProvider ConfigurationProvider { get; }
        IHostingEnvironment HostingEnvironment { get; }

        string DefaultModelStorageFolder<TEntity>(TEntity model)
            where TEntity : DomainModel;
    }

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
            var storeUsers  = ConfigurationProvider.GetSetting(ResourcePaths.StoreUsers);
            var modelRootFolder = ConfigurationProvider.GetSetting($"ResourcePaths:Folders:{typeof(TEntity).Name}");

            string modelStorageFolder = $"{HostingEnvironment.WebRootPath}{storeUsers}{model.User.Id}/{modelRootFolder}/{model.Id}/";

            // normalize
            return Path.GetFullPath(modelStorageFolder);
        }
    }
}
