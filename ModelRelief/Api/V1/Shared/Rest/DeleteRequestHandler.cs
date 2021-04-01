// -----------------------------------------------------------------------
// <copyright file="DeleteRequestHandler.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using System;
    using System.IO;
    using System.Threading;
    using System.Threading.Tasks;
    using AutoMapper;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Features.Settings;
    using ModelRelief.Services;
    using ModelRelief.Services.Relationships;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents the concrete handler for a DELETE model request.
    /// </summary>
    /// <typeparam name="TEntity">Domain model.</typeparam>
    public class DeleteRequestHandler<TEntity>  : ValidatedHandler<DeleteRequest<TEntity>, object>
        where TEntity   : DomainModel
    {
        private IStorageManager StorageManager { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="DeleteRequestHandler{TEntity}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IWebHostEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="dependencyManager">Services for dependency processing.</param>
        /// <param name="storageManager">Services for file system storage.</param>
        /// <param name="settingsManager">ISettingsManager</param>
        /// <param name="query">IQuery</param>
        /// <param name="modelReferenceValidator">IModelReferenceValidator</param>
        public DeleteRequestHandler(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IWebHostEnvironment hostingEnvironment,
            Services.IConfigurationProvider configurationProvider,
            IDependencyManager dependencyManager,
            IStorageManager storageManager,
            ISettingsManager settingsManager,
            IQuery query,
            IModelReferenceValidator modelReferenceValidator)
            : base(dbContext, loggerFactory, mapper, hostingEnvironment, configurationProvider, dependencyManager, null, settingsManager, query, modelReferenceValidator)
        {
            StorageManager = storageManager;
        }

        /// <summary>
        /// Removes files associated with a resource.
        /// WIP: Should orphan folder paring be done as an adminstrative tool?
        /// </summary>
        private void DeleteModelStorage(TEntity domainModel)
        {
            // not a file-backed model?
            if (!typeof(FileDomainModel).IsAssignableFrom(typeof(TEntity)))
                return;

            var fileDomainModel = domainModel as FileDomainModel;
            fileDomainModel.FileTimeStamp = null;

            // The Path exists only if an associated file has been posted.
            // There is no mechanism for deleting <only> the file once a model has been created.
            if (string.IsNullOrEmpty(StorageManager.GetAbsolutePath(fileDomainModel.Path)))
                return;

            var modelStorageFolder = fileDomainModel.StorageFolder;
            var fileFolder = Path.GetFullPath(StorageManager.GetAbsolutePath(fileDomainModel.Path));

            // confirm that parent folder of file matches the storage folder
            if (!string.Equals(modelStorageFolder, fileFolder, StringComparison.InvariantCultureIgnoreCase))
            {
                Logger.LogWarning($"DeleteRequest: The parent folder of the file to be deleted '{fileFolder}' does not match the user storage folder '{modelStorageFolder}'.");
                return;
            }

            // check for existence of model file
            var fileName = Path.Combine(fileFolder, fileDomainModel.Name);
            if (!File.Exists(fileName))
            {
                Logger.LogWarning($"DeleteRequest: The file to be deleted '{fileName}' does not exist.");
                return;
            }

            Logger.LogWarning($"Deleting model file: {fileName}");
            File.Delete(fileName);

            // remove parent folder (only if empty)
            if (Files.IsFolderEmpty(modelStorageFolder))
            {
                // https://stackoverflow.com/questions/5617320/given-full-path-check-if-path-is-subdirectory-of-some-other-path-or-otherwise
                Files.DeleteFolder(modelStorageFolder, false);
            }
        }

        /// <summary>
        /// Handles the DELETE model request.
        /// </summary>
        /// <param name="message">Request message</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// <returns>Null object</returns>
        public override async Task<object> OnHandle(DeleteRequest<TEntity> message, CancellationToken cancellationToken)
        {
            var modelToRemove = await Query.FindDomainModelAsync<TEntity>(message.User, message.Id);

            // remove model file if present
            DeleteModelStorage(modelToRemove);

            DbContext.Remove(modelToRemove);

            await DependencyManager.PersistChangesAsync(modelToRemove, cancellationToken);

            return null;
        }
    }
}