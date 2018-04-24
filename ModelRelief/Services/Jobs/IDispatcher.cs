// -----------------------------------------------------------------------
// <copyright file="IDispatcher.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services.Jobs
{
    using System.Threading;
    using System.Threading.Tasks;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Domain;

    /// <summary>
    /// Dispatch manager.
    /// Queues long-running processes that generate or modify files.
    /// </summary>
    public interface IDispatcher
    {
        // Worker Process
        Task<bool> GenerateDepthBufferAsync(Domain.DepthBuffer depthBuffer, CancellationToken cancellationToken = default);
        Task<bool> GenerateMeshAsync(Domain.Mesh mesh, CancellationToken cancellationToken = default);
    }
}
