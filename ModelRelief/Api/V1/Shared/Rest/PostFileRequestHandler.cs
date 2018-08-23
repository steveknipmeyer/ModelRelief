// -----------------------------------------------------------------------
// <copyright file="PostFileRequestHandler.cs" company="ModelRelief">
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
    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Errors;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
    using ModelRelief.Services;
    using ModelRelief.Services.Relationships;
    using ModelRelief.Utility;

    using static ModelRelief.Services.StorageManager;

    /// <summary>
    /// Represents a handler for a POST request to create a new model.
    /// </summary>
    /// <typeparam name="TEntity">Domain model</typeparam>
    /// <typeparam name="TGetModel">DTO GET model.</typeparam>
    public class PostFileRequestHandler<TEntity, TGetModel> : ValidatedHandler<PostFileRequest<TEntity, TGetModel>, TGetModel>
        where TEntity    : DomainModel, new()
        where TGetModel  : IModel
    {
        private IStorageManager StorageManager { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="PostFileRequestHandler{TEntity, TGetModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="userManager">UserManager (ClaimsPrincipal -> ApplicationUser).</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="dependencyManager">Services for dependency processing.</param>
        /// <param name="storageManager">Services for file system storage.</param>
        public PostFileRequestHandler(
            ModelReliefDbContext dbContext,
            UserManager<ApplicationUser> userManager,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IHostingEnvironment hostingEnvironment,
            Services.IConfigurationProvider  configurationProvider,
            IDependencyManager dependencyManager,
            IStorageManager storageManager)
            : base(dbContext, userManager, loggerFactory, mapper, hostingEnvironment, configurationProvider, dependencyManager, null)
        {
            StorageManager = storageManager;
        }

        /// <summary>
        /// Handles a POST file request.
        /// </summary>
        /// <param name="message">POST file request.</param>
        /// <param name="cancellationToken">Token to allow the async operation to be cancelled.</param>
        /// <returns></returns>
        public override async Task<TGetModel> OnHandle(PostFileRequest<TEntity, TGetModel> message, CancellationToken cancellationToken)
        {
            // not a file-backed model?
            if (!typeof(FileDomainModel).IsAssignableFrom(typeof(TEntity)))
                throw new ModelNotBackedByFileException(typeof(TEntity));

            var domainModel = await FindModelAsync<TEntity>(message.User, message.Id, throwIfNotFound: true);
            var fileDomainModel = domainModel as FileDomainModel;

            var fileName = Path.Combine(StorageManager.DefaultModelStorageFolder(domainModel), domainModel.Name);

            await Files.WriteFileFromByteArray(fileName, message.NewFile.Raw);

            // update file metadata; normalize path
            fileDomainModel.Path = GetRelativePath(Path.GetFullPath($"{Path.GetDirectoryName(fileName)}/"));
            fileDomainModel.FileTimeStamp = DateTime.Now;

            if (fileDomainModel is GeneratedFileDomainModel generatedFileDomainModel)
                generatedFileDomainModel.FileIsSynchronized = true;

            await DependencyManager.PersistChangesAsync(fileDomainModel, cancellationToken);

            return Mapper.Map<TGetModel>(domainModel);
        }
    }
}
