// -----------------------------------------------------------------------
// <copyright file="FileRequestHandler.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using System.Collections.Generic;
    using System.IO;
    using System.Threading;
    using System.Threading.Tasks;
    using AutoMapper;
    using FluentValidation;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore.ChangeTracking;
    using Microsoft.EntityFrameworkCore.Metadata;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Errors;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Services;
    using ModelRelief.Services.Relationships;

    /// <summary>
    /// Represents the concrete handler for a FileRequest.
    /// </summary>
    /// <typeparam name="TEntity">Domain model.</typeparam>
    public class FileRequestHandler<TEntity>  : ValidatedHandler<FileRequest<TEntity>, bool>
        where TEntity   : DomainModel
    {
        public IStorageManager StorageManager { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="FileRequestHandler{TEntity}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="userManager">UserManager (ClaimsPrincipal -> ApplicationUser).</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="dependencyManager">Services for dependency processing.</param>
        /// <param name="validators">List of validators</param>
        /// <param name="storageManager">Services for file system storage.</param>
        public FileRequestHandler(
            ModelReliefDbContext dbContext,
            UserManager<ApplicationUser> userManager,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IHostingEnvironment hostingEnvironment,
            Services.IConfigurationProvider configurationProvider,
            IDependencyManager dependencyManager,
            IEnumerable<IValidator<FileRequest<TEntity>>> validators,
            IStorageManager storageManager)
            : base(dbContext, userManager, loggerFactory, mapper, hostingEnvironment, configurationProvider, dependencyManager, validators)
        {
            StorageManager = storageManager;
        }

        /// <summary>
        /// Gnerates a file-backed resource when its dependencies have changed.
        /// </summary>
        /// <param name="fileRequest">FileRequest created during dependency processing.</param>
        /// <param name="generatedFileDomainModel">Domain model.</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// <returns>True if succesful.</returns>
        public virtual async Task<bool> ProcessGenerate(FileRequest<TEntity> fileRequest, GeneratedFileDomainModel generatedFileDomainModel, CancellationToken cancellationToken)
        {
            Logger.LogError($"FileRequestHandler: Generate is not implemented: Type = {typeof(TEntity).Name}, Model Id = {fileRequest.TransactionEntity.PrimaryKey}, UserId = {fileRequest.TransactionEntity.UserId}");
            await Task.CompletedTask;
            return false;
        }

        /// <summary>
        /// Renames a file-backed resource when the metadata has changed.
        /// </summary>
        /// <param name="fileRequest">FileRequest created during dependency processing.</param>
        /// <param name="fileDomainModel">Domain model.</param>
        /// <returns>True if succesful.</returns>
        public virtual async Task<bool> ProcessRename(FileRequest<TEntity> fileRequest, FileDomainModel fileDomainModel)
        {
            // find original Name property
            var originalName = fileRequest.TransactionEntity.ChangeTrackerEntity.GetDatabaseValues()[PropertyNames.Name] as string;

            var filePath = Path.GetDirectoryName(fileDomainModel.FileName);
            var originalFile = Path.Combine(filePath, $"{originalName}");

            if (!File.Exists(originalFile))
            {
                Logger.LogError($"FileRequestHandler: {originalFile} does not exist.");
                throw new ModelFileNotFoundException(typeof(TEntity), originalName);
            }
            Logger.LogInformation($"FileRequestHandler: {originalFile} will be renamed to {fileDomainModel.FileName}.");
            File.Move(originalFile, fileDomainModel.FileName);

            await Task.CompletedTask;
            return true;
        }

        /// <summary>
        /// Handles the FileRequest.
        /// </summary>
        /// <param name="message">Request message</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// <returns></returns>
        public override async Task<bool> OnHandle(FileRequest<TEntity> message, CancellationToken cancellationToken)
        {
            // not a file-backed model?
            if (!typeof(FileDomainModel).IsAssignableFrom(typeof(TEntity)))
                throw new ModelNotBackedByFileException(typeof(TEntity));

            var fileDomainModel = await FindModelAsync<TEntity>(message.TransactionEntity.UserId, message.TransactionEntity.PrimaryKey, throwIfNotFound: true) as FileDomainModel;

            switch (message.Operation)
            {
                case FileOperation.Rename:
                    {
                        return await ProcessRename(message, fileDomainModel);
                    }

                case FileOperation.Generate:
                    {
                        var generatedFileDomainModel = fileDomainModel as GeneratedFileDomainModel;
                        return await ProcessGenerate(message, generatedFileDomainModel, cancellationToken);
                    }

                default:
                    Logger.LogError($"FileRequestHandler: Invalid operation {message.Operation}, UserId = {message.TransactionEntity.UserId}, Model Id = {message.TransactionEntity.PrimaryKey}");
                    return false;
            }
        }
    }
}