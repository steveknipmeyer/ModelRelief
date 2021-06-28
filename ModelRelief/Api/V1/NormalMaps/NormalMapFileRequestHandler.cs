// -----------------------------------------------------------------------
// <copyright file="NormalMapFileRequestHandler.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;
    using AutoMapper;
    using FluentValidation;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Features.Settings;
    using ModelRelief.Services;
    using ModelRelief.Services.Jobs;
    using ModelRelief.Services.Relationships;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents the concrete handler for a NormalMap FileRequest.
    /// </summary>
    public class NormalMapFileRequestHandler : FileRequestHandler<Domain.NormalMap>
    {
        public IDispatcher Dispatcher { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="NormalMapFileRequestHandler"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IWebHostEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="dependencyManager">Services for dependency processing.</param>
        /// <param name="validators">List of validators</param>
        /// <param name="storageManager">Services for file system storage.</param>
        /// <param name="dispatcher">Dispatcher for long-runnning processes.</param>
        /// <param name="settingsManager">ISettingsManager</param>
        /// <param name="query">IQuery</param>
        /// <param name="modelReferenceValidator">IModelReferenceValidator</param>
        public NormalMapFileRequestHandler(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IWebHostEnvironment hostingEnvironment,
            Services.IConfigurationProvider configurationProvider,
            IDependencyManager dependencyManager,
            IEnumerable<IValidator<FileRequest<Domain.NormalMap>>> validators,
            IStorageManager storageManager,
            IDispatcher dispatcher,
            ISettingsManager settingsManager,
            IQuery query,
            IModelReferenceValidator modelReferenceValidator)
            : base(dbContext, loggerFactory, mapper, hostingEnvironment, configurationProvider, dependencyManager, validators, storageManager, settingsManager, query, modelReferenceValidator)
        {
            Dispatcher = dispatcher ?? throw new System.ArgumentNullException(nameof(dispatcher));
        }

        /// <summary>
        /// Gnerates a file-backed resource when its dependencies have changed.
        /// </summary>
        /// <param name="fileRequest">FileRequest created during dependency processing.</param>
        /// <param name="generatedFileDomainModel">Domain model.</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// <returns>True if succesful.</returns>
        public override async Task<bool> ProcessGenerate(FileRequest<Domain.NormalMap> fileRequest, GeneratedFileDomainModel generatedFileDomainModel, CancellationToken cancellationToken)
        {
            var normalMap = generatedFileDomainModel as Domain.NormalMap;
            Logger.LogInformation($"NormalMap [Model Id = {fileRequest.TransactionEntity.PrimaryKey}, UserId = {fileRequest.TransactionEntity.UserId}, file = {generatedFileDomainModel.FileName}] has been queued for file generation.");
            return await Dispatcher.GenerateNormalMapAsync(normalMap, cancellationToken);
        }

        /// <summary>
        /// Handles the FileRequest.
        /// </summary>
        /// <param name="request">Request</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        public override async Task<bool> OnHandle(FileRequest<Domain.NormalMap> request, CancellationToken cancellationToken)
        {
            return await base.OnHandle(request, cancellationToken);
        }
    }
}