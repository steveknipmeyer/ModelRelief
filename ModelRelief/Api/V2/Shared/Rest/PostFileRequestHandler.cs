﻿// ------------------------------------------------------------------------// 
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
using ModelRelief.Api.V2.Extensions;
using ModelRelief.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Hosting;
using ModelRelief.Utility;
using ModelRelief.Services;

namespace ModelRelief.Api.V2.Shared.Rest
{
    /// <summary>
    /// Represents a handler for a POST request to create a new model.
    /// </summary>
    /// <typeparam name="TEntity">Domain model</typeparam>
    /// <typeparam name="TGetModel">DTO GET model.</typeparam>
    public class PostFileRequestHandler<TEntity, TGetModel> : ValidatedHandler<PostFileRequest<TEntity, TGetModel>, TGetModel>
        where TEntity    : ModelReliefModel, IFileResource, new()
        where TGetModel  : IGetModel
    {
        public UserManager<ApplicationUser> UserManager { get; }
        public IHostingEnvironment HostingEnvironment { get; }
        public Services.IConfigurationProvider ConfigurationProvider { get; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="userManager">UserManager.</param>
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="validators">All validators matching IValidator for the given request.</param>
        public PostFileRequestHandler(ModelReliefDbContext dbContext, IMapper mapper, UserManager<ApplicationUser> userManager, IHostingEnvironment hostingEnvironment, Services.IConfigurationProvider  configurationProvider, IEnumerable<IValidator<PostFileRequest<TEntity, TGetModel>>> validators)
            : base(dbContext, mapper, validators)
        {
            UserManager = userManager;
            HostingEnvironment = hostingEnvironment;
            ConfigurationProvider = configurationProvider;
        }

        /// <summary>
        /// Handles a POST file request.
        /// </summary>
        /// <param name="message">POST file request.</param>
        /// <param name="cancellationToken">Token to allow the async operation to be cancelled.</param>
        /// <returns></returns>
        public override async Task<TGetModel> OnHandle(PostFileRequest<TEntity, TGetModel> message, CancellationToken cancellationToken)
        {
            // find ApplicationUser
            var user = await Identity.GetCurrentUserAsync(UserManager, message.User);

            // populate model properties (placeholder Name = User.Id)
            var newModel = new TEntity() {Name = $"{user.Id}"};
            newModel.User = user;
            
            // add to repository
            DbContext.Set<TEntity>().Add(newModel);

            // commit; force Id to be assigned immediately
            DbContext.SaveChanges();

            // write file : file name = newly-created model Id
            var storeUsers  = ConfigurationProvider.GetSetting(ResourcePaths.StoreUsers);
            var modelFolder = ConfigurationProvider.GetSetting(($"{ResourcePaths.ModelFolders}:{typeof(TEntity).Name}"));
            string modelPath = $"{storeUsers}{user.Id}/{modelFolder}/{newModel.Id}/";
            string modelName = $"{newModel.Id}";

            string fileName = $"{HostingEnvironment.WebRootPath}{modelPath}{modelName}";
            await Files.WriteFileFromByteArray(fileName, message.NewFile.Raw);

            return Mapper.Map<TGetModel>(newModel);
        }
    }
}
