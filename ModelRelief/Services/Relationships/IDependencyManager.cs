// -----------------------------------------------------------------------
// <copyright file="IDependencyManager.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services.Relationships
{
    using System.Threading;
    using System.Threading.Tasks;
    using ModelRelief.Database;
    using ModelRelief.Domain;

    /// <summary>
    /// Dependency manager.
    /// Provides support for persisting changes and updating dependencies.
    /// </summary>
    public interface IDependencyManager
    {
        ModelReliefDbContext DbContext { get; }

        Task<int> PersistChangesAsync(DomainModel model, CancellationToken cancellationToken = default);
    }
}
