// -----------------------------------------------------------------------
// <copyright file="IDispatcher.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services.Jobs
{
    using System.Threading;
    using System.Threading.Tasks;

    /// <summary>
    /// Dispatch manager.
    /// Queues long-running processes that generate or modify files.
    /// </summary>
    public interface IDispatcher
    {
        // Worker Process
        Task<bool> GenerateDepthBufferAsync(Domain.DepthBuffer depthBuffer, CancellationToken cancellationToken = default);
        Task<bool> GenerateMeshAsync(Domain.Mesh mesh, CancellationToken cancellationToken = default);
        Task<bool> GenerateNormalMapAsync(Domain.NormalMap normalMap, CancellationToken cancellationToken = default);
    }
}
