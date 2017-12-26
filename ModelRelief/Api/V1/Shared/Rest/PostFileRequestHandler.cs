// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
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

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="userManager">UserManager (ClaimsPrincipal -> ApplicationUser).</param>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="logger">ILogger.</param>
       public PostFileRequestHandler(UserManager<ApplicationUser> userManager, ModelReliefDbContext dbContext, IMapper mapper, IHostingEnvironment hostingEnvironment, Services.IConfigurationProvider  configurationProvider, ILogger<TEntity> logger)
            : base(userManager, dbContext, mapper, hostingEnvironment, configurationProvider, null)
        {
            Logger = logger;
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

            var targetModel = await FindModelAsync<TEntity>(message.User, message.Id);
            var targetModelFileResource = targetModel as FileDomainModel;

            // ApplicationUser determines file path
            var user = targetModel.User;
            
            var storageManager = new StorageManager(HostingEnvironment, ConfigurationProvider);
            var fileName = Path.Combine(storageManager.DefaultModelStorageFolder(targetModel), targetModel.Name);

            await Files.WriteFileFromByteArray(fileName, message.NewFile.Raw);

            // file path is known now
            targetModelFileResource.Path = $"{Path.GetDirectoryName(fileName)}/";

            return Mapper.Map<TGetModel>(targetModel);
        }
    }
}
