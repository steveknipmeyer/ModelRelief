// -----------------------------------------------------------------------
// <copyright file="IStorageManager.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
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

        string GetAbsolutePath(string path);
        string GetRelativePath(string path);

        string DefaultModelStorageFolder<TEntity>(TEntity model)
            where TEntity : DomainModel;

        string WorkingStorageFolder(string userId);
    }
}
