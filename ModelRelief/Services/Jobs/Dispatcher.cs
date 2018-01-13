// -----------------------------------------------------------------------
// <copyright file="Dispatcher.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services.Jobs
{
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Utility;

    /// <summary>
    /// Dispatch manager.
    /// Queues long-running processes that generate or modify files.
    /// </summary>
    public class Dispatcher : IDispatcher
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Dispatcher"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="storageManager">Services for file system storage.</param>
        public Dispatcher(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IHostingEnvironment hostingEnvironment,
            IConfigurationProvider configurationProvider,
            IStorageManager storageManager)
        {
            DbContext             = dbContext;
            Logger                = loggerFactory.CreateLogger<Dispatcher>();
            HostingEnvironment    = hostingEnvironment;
            ConfigurationProvider = configurationProvider;
            StorageManager        = storageManager;
        }

        public ModelReliefDbContext DbContext { get; }
        public ILogger Logger { get; }
        public IHostingEnvironment HostingEnvironment { get; }
        public IConfigurationProvider ConfigurationProvider { get; }
        public IStorageManager StorageManager { get; }

        /// <summary>
        /// Dispatches a process to create a DepthBuffer from its dependencies (e.g. Model3d, Camera).
        /// </summary>
        /// <param name="depthBuffer">DepthBuffer.</param>
        /// <param name="fileName">FIle name of DepthBuffer.</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// /// <returns>True if successful.</returns>
        public async Task<bool> GenerateDepthBufferAsync(Domain.DepthBuffer depthBuffer, string fileName, CancellationToken cancellationToken = default)
        {
            Logger.LogError($"{nameof(GenerateDepthBufferAsync)} is not implemented.");
            await Task.CompletedTask;
            return false;
        }

        /// <summary>
        /// Dispatches a process to create a Mesh from its dependencies (e.g. DepthBuffer, MeshTransform).
        /// </summary>
        /// <param name="mesh">Mesh.</param>
        /// <param name="fileName">FIle name of DepthBuffer.</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// /// <returns>True if successful.</returns>
        public async Task<bool> GenerateMeshAsync(Domain.Mesh mesh, string fileName, CancellationToken cancellationToken = default)
        {
            Logger.LogInformation($"{nameof(GenerateMeshAsync)} process queued.");

            // FileIsSynchronized is permitted to become true only when the file has been generated.
            mesh.FileIsSynchronized = false;
            await DbContext.SaveChangesAsync();

            // WIP: mesh generation process
            Files.SleepForTimeStamp();

            // The job is complete and the file is syncrhonized.
            mesh.FileIsSynchronized = true;
            await DbContext.SaveChangesAsync();

            return true;
        }
    }
}
