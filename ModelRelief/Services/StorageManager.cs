// -----------------------------------------------------------------------
// <copyright file="StorageManager.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
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
        public IWebHostEnvironment HostingEnvironment { get; }
        public IConfigurationProvider ConfigurationProvider { get; }

        public StorageManager(IWebHostEnvironment hostingEnvironment, Services.IConfigurationProvider  configurationProvider)
        {
            HostingEnvironment = hostingEnvironment;
            ConfigurationProvider = configurationProvider;
        }

        /// <summary>
        /// Gets the server ContentRootPath.
        /// </summary>
        public string ContentRootPath
        {
            get
            {
                // N.B. ContentRootPath contains a trailing slash when running the integration tests.
                // The normal runtime mode (web host) does not include a slash. Strip, if present.
                return HostingEnvironment.ContentRootPath.TrimEnd(Path.DirectorySeparatorChar);
            }
        }

        /// <summary>
        /// Returns a path relative to the web ContentRootPath.
        /// This is the Path property of a FileDomainModel entity.
        /// </summary>
        /// <param name="path">Path to process.</param>
        /// <returns>Path relative to ContentRootPath. </returns>
        public string GetRelativePath(string path)
        {
            // verify path contains ContentRootPath
            if (path.IndexOf(ContentRootPath) != 0)
                return path;

            // ContentRootPath does not end with directory terminator; skip leading terminator in following relative path
            var relativePath = path.Substring(ContentRootPath.Length + 1);

            return relativePath;
        }
        /// <summary>
        /// Returns an absolute path including the ContentRootPath root.
        /// </summary>
        /// <param name="path">Relative path to combine with ContentRootPath.</param>
        /// <returns>Absolute path including ContentRootPath</returns>
        public string GetAbsolutePath(string path)
        {
            var absolutePath = $"{ContentRootPath}{System.IO.Path.DirectorySeparatorChar}{path}";

            // normalize
            absolutePath = Path.GetFullPath(absolutePath);

            return absolutePath;
        }

        /// <summary>
        /// Returns the default model storage folder for a given model instance.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="model">Model instance. </param>
        public string DefaultModelStorageFolder<TEntity>(TEntity model)
            where TEntity : DomainModel
        {
            var storeUsersFolder = ConfigurationProvider.GetSetting(Paths.StoreUsers);
            var modelRootFolder  = ConfigurationProvider.GetSetting($"Paths:ResourceFolders:{typeof(TEntity).Name}");

            // N.B. Path.Combine does not handle path fragments that mix forward and backward slashes.
            string modelStorageFolder = $"{GetAbsolutePath(storeUsersFolder)}{model.UserId}/{modelRootFolder}/{model.Id}/";

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

            // N.B. Path.Combine does not handle path fragments that mix forward and backward slashes.
            string workingStorageFolder = $"{GetAbsolutePath(storeUsersFolder)}{userId}/{workingFolder}/";

            // normalize
            return Path.GetFullPath(workingStorageFolder);
        }
    }
}
