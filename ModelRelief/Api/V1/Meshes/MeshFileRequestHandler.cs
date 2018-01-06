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
    /// Represents the concrete handler for a Mesh FileRequest.
    /// </summary>
    public class MeshFileRequestHandler : FileRequestHandler<Domain.Mesh>
    {
        /// <summary>
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
        public MeshFileRequestHandler(ModelReliefDbContext dbContext, UserManager<ApplicationUser> userManager, ILoggerFactory loggerFactory, IMapper mapper, IHostingEnvironment hostingEnvironment, 
                                             Services.IConfigurationProvider configurationProvider, IDependencyManager dependencyManager, 
                                             IEnumerable<IValidator<FileRequest<Domain.Mesh>>> validators,  
                                             IStorageManager storageManager)
            : base(dbContext, userManager, loggerFactory, mapper, hostingEnvironment, configurationProvider, dependencyManager, validators, storageManager)
        {
        }

        /// <summary>
        /// Gnerates a file-backed resource when its dependencies have changed.
        /// </summary>
        /// <param name="fileRequest">FileRequest created during dependency processing.</param>
        /// <param name="fileDomainModel">Domain model.</param>
        /// <param name="fileName">Filename to generate.</param>
        /// <returns>True if succesful.</returns>
        public override async Task<bool> ProcessGenerate(FileRequest<Domain.Mesh> fileRequest, FileDomainModel fileDomainModel, string fileName)
        {
            Logger.LogInformation($"Mesh [Model Id = {fileRequest.TransactionEntity.PrimaryKey}, UserId = {fileRequest.TransactionEntity.UserId}, file = {fileName}] has been queued for file generation.");
            await Task.CompletedTask;
            return true;    
        }

        /// <summary>
        /// Handles the FileRequest.
        /// </summary>
        /// <param name="message">Request message</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// <returns></returns>
        public override async Task<bool> OnHandle(FileRequest<Domain.Mesh> message, CancellationToken cancellationToken)
        {
            return await base.OnHandle(message, cancellationToken);
        }
    }
}