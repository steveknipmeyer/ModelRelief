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
        IHostingEnvironment HostingEnvironment { get; }

        string DefaultModelStorageFolder<TEntity>(TEntity model)
            where TEntity : DomainModel;
    }
}
