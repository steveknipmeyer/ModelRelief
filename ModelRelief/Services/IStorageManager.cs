// -----------------------------------------------------------------------
// <copyright file="IStorageManager.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services
{
    using Microsoft.AspNetCore.Hosting;
    using ModelRelief.Domain;

    /// <summary>
    /// User storage manager interface.
    /// Provides file services for file-based resources.
    /// </summary>
    public interface IStorageManager
    {
        IConfigurationProvider ConfigurationProvider { get; }
        IWebHostEnvironment HostingEnvironment { get; }
        string ContentRootPath { get; }

        string GetRelativePath(string path);
        string GetAbsolutePath(string path);

        string DefaultModelStorageFolder<TEntity>(TEntity model)
            where TEntity : DomainModel;

        string WorkingStorageFolder(string userId);
    }
}
