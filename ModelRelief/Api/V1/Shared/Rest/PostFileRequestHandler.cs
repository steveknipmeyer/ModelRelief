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

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    /// Represents a handler for a POST request to create a new model.
    /// </summary>
    /// <typeparam name="TEntity">Domain model</typeparam>
    /// <typeparam name="TGetModel">DTO GET model.</typeparam>
    public class PostFileRequestHandler<TEntity, TGetModel> : ValidatedHandler<PostFileRequest<TEntity, TGetModel>, TGetModel>
        where TEntity    : DomainModel, IFileResource, new()
        where TGetModel  : ITGetModel
    {
        public IHostingEnvironment HostingEnvironment { get; }
        public Services.IConfigurationProvider ConfigurationProvider { get; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="userManager">UserManager (ClaimsPrincipal -> ApplicationUser).</param>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="validators">All validators matching IValidator for the given request.</param>
        public PostFileRequestHandler(UserManager<ApplicationUser> userManager, ModelReliefDbContext dbContext, IMapper mapper, IHostingEnvironment hostingEnvironment, Services.IConfigurationProvider  configurationProvider, IEnumerable<IValidator<PostFileRequest<TEntity, TGetModel>>> validators)
            : base(userManager, dbContext, mapper, validators)
        {
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
            var targetModel = await FindModelAsync<TEntity>(message.User, message.Id);
            if (targetModel == null)
                throw new EntityNotFoundException(typeof(TEntity), message.Id);

            // ApplicationUser determines file path
            var user = targetModel.User;

            // write file : file name = resource Name
            var storeUsers  = ConfigurationProvider.GetSetting(ResourcePaths.StoreUsers);
            var modelFolder = ConfigurationProvider.GetSetting(($"ResourcePaths:Folders:{typeof(TEntity).Name}"));
            string modelPath = $"{storeUsers}{user.Id}/{modelFolder}/{targetModel.Id}/";
            string modelName = $"{targetModel.Id}";

            string fileName = $"{HostingEnvironment.WebRootPath}{modelPath}{modelName}";
            await Files.WriteFileFromByteArray(fileName, message.NewFile.Raw);

            // file path is known now
            targetModel.Path = fileName;

            return Mapper.Map<TGetModel>(targetModel);
        }
    }
}
