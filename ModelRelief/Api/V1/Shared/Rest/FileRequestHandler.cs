﻿// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ModelRelief.Api.V1.Shared.Errors;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Services;
using ModelRelief.Utility;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    /// Represents the concrete handler for a FileRequest.
    /// </summary>
    /// <typeparam name="TEntity">Domain model.</typeparam>
    public class FileRequestHandler<TEntity>  : ValidatedHandler<FileRequest<TEntity>, bool>
        where TEntity   : DomainModel
    {
        private ILogger<FileRequestHandler<TEntity>> Logger { get; }
        public IStorageManager StorageManager { get; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="userManager">UserManager (ClaimsPrincipal -> ApplicationUser).</param>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="dependencyManager">Services for dependency processing.</param>
        /// <param name="validators">List of validators</param>
        /// <param name="logger">ILogger.</param>
        /// <param name="storageManager">Services for file system storage.</param>
        public FileRequestHandler(UserManager<ApplicationUser> userManager, ModelReliefDbContext dbContext, IMapper mapper, IHostingEnvironment hostingEnvironment, 
                                  Services.IConfigurationProvider configurationProvider, IDependencyManager dependencyManager, IEnumerable<IValidator<FileRequest<TEntity>>> validators, 
                                  ILogger<FileRequestHandler<TEntity>> logger, IStorageManager storageManager)
            : base(userManager, dbContext, mapper, hostingEnvironment, configurationProvider, dependencyManager, validators)
        {
            Logger         = logger;
            StorageManager = storageManager;
        }

        /// <summary>
        /// Handles the FileRequest.
        /// </summary>
        /// <param name="message">Request message</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// <returns></returns>
        public override async Task<bool> OnHandle(FileRequest<TEntity> message, CancellationToken cancellationToken)
        {
            Logger.LogInformation($"FileRequestHandler: Id = {message.Id}");
            // not a file-backed model?
            if (!typeof(FileDomainModel).IsAssignableFrom(typeof(TEntity)))
                throw new ModelNotBackedByFileException(typeof(TEntity));

            var domainModel = await FindModelAsync<TEntity>(message.User, message.Id, throwIfNotFound: true);
            var fileDomainModel = domainModel as FileDomainModel;
            
            var fileName = Path.Combine(StorageManager.DefaultModelStorageFolder(domainModel), domainModel.Name);

            await Task.CompletedTask;

            return true;
        }
    }
}