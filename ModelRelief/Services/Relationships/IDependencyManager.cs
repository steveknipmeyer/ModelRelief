// -----------------------------------------------------------------------
// <copyright file="IDependencyManager.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
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
