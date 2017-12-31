// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Api.V1.Extensions;
using ModelRelief.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Hosting;
using ModelRelief.Utility;
using ModelRelief.Services;
using ModelRelief.Api.V1.Shared.Errors;
using Microsoft.Extensions.Logging;
using System.IO;

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    /// Represents a handler for a POST request to create a new model.
    /// </summary>
    /// <typeparam name="TEntity">Domain model</typeparam>
    /// <typeparam name="TGetModel">DTO GET model.</typeparam>
    public class PostFileRequestHandler<TEntity, TGetModel> : ValidatedHandler<PostFileRequest<TEntity, TGetModel>, TGetModel>
        where TEntity    : DomainModel, new()
        where TGetModel  : ITGetModel
    {
        private ILogger<TEntity> Logger { get; }
        private IStorageManager StorageManager { get; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="userManager">UserManager (ClaimsPrincipal -> ApplicationUser).</param>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="dependencyManager">Services for dependency processing.</param>
        /// <param name="logger">ILogger.</param>
        /// <param name="storageManager">Services for file system storage.</param>
        public PostFileRequestHandler(UserManager<ApplicationUser> userManager, ModelReliefDbContext dbContext, IMapper mapper, IHostingEnvironment hostingEnvironment, Services.IConfigurationProvider  configurationProvider, IDependencyManager dependencyManager, ILogger<TEntity> logger, IStorageManager storageManager)
            : base(userManager, dbContext, mapper, hostingEnvironment, configurationProvider, dependencyManager, null)
        {
            Logger = logger;
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

            // update file metadata
            fileDomainModel.Path = $"{Path.GetDirectoryName(fileName)}/";
            fileDomainModel.FileTimeStamp = DateTime.Now;

            var generatedFileDomainModel = fileDomainModel as GeneratedFileDomainModel;
            if (generatedFileDomainModel != null)
                generatedFileDomainModel.FileIsSynchronized = true;

            await DependencyManager.PersistChangesAsync(fileDomainModel, cancellationToken);

            return Mapper.Map<TGetModel>(domainModel);
        }
    }
}
