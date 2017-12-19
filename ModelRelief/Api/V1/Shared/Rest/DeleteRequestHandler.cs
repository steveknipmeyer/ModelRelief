// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Api.V1.Shared.Errors;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Utility;
using System;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    /// Represents the concrete handler for a DELETE model request.
    /// </summary>
    /// <typeparam name="TEntity">Domain model.</typeparam>
    public class DeleteRequestHandler<TEntity>  : ValidatedHandler<DeleteRequest<TEntity>, object>
        where TEntity   : DomainModel
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
        public DeleteRequestHandler(UserManager<ApplicationUser> userManager, ModelReliefDbContext dbContext, IMapper mapper, IHostingEnvironment hostingEnvironment, Services.IConfigurationProvider  configurationProvider)
            : base(userManager, dbContext, mapper, null)
        {
            HostingEnvironment = hostingEnvironment;
            ConfigurationProvider = configurationProvider;
        }

        /// <summary>
        /// Handles the DELETE model request.
        /// </summary>
        /// <param name="message">Request message</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// <returns></returns>
        public override async Task<object> OnHandle(DeleteRequest<TEntity> message, CancellationToken cancellationToken)
        {
            var modelToRemove = await FindModelAsync<TEntity>(message.User, message.Id);
            if (modelToRemove == null)
                throw new EntityNotFoundException(typeof(TEntity), message.Id);
            
            // remove user storage
            var modelStorageFolder = Files.ModelStorageFolder(modelToRemove, modelToRemove.User, ConfigurationProvider, HostingEnvironment);
            Debug.WriteLine ($"Deleting model storage folder: {modelStorageFolder}");
//          Files.DeleteFolder(modelStorageFolder, true);

            DbContext.Remove(modelToRemove);

            return null;
        }
    }
}