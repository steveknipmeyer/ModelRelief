// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ModelRelief.Api.V1.Shared.Errors;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Utility;
using System;
using System.Diagnostics;
using System.IO;
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
        public DeleteRequestHandler(UserManager<ApplicationUser> userManager, ModelReliefDbContext dbContext, IMapper mapper, IHostingEnvironment hostingEnvironment, Services.IConfigurationProvider configurationProvider, ILogger<TEntity> logger)
            : base(userManager, dbContext, mapper, hostingEnvironment, configurationProvider, null)
        {
            Logger = logger;
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
            
            // The Path exists only if an associated file has been posted. 
            // There is no mechanism for deleting <only> the file once a model has been created.
            if (String.IsNullOrEmpty(fileDomainModel.Path))
                return;
            
            var modelStorageFolder = fileDomainModel.StorageFolder;
            var fileFolder = Path.GetFullPath(fileDomainModel.Path);

            // confirm that parent folder of file matches the storage folder
            if (!String.Equals(modelStorageFolder, fileFolder, StringComparison.InvariantCultureIgnoreCase))
            {
                Logger.LogError($"DeleteRequest: The parent folder of the file to be deleted '{fileFolder}' does not match the user storage folder '{modelStorageFolder}'.");
                return;
            }

            // check for existence of model file
            var fileName = Path.Combine(fileFolder, fileDomainModel.Name);
            if (!File.Exists(fileName))
            {
                Logger.LogError($"DeleteRequest: The file to be deleted '{fileName}' does not exist.");
                return;
            }           

            Logger.LogWarning ($"Deleting model file: {fileName}");
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
        /// <returns></returns>
        public override async Task<object> OnHandle(DeleteRequest<TEntity> message, CancellationToken cancellationToken)
        {
            var modelToRemove = await FindModelAsync<TEntity>(message.User, message.Id);

            // remove model file if present
            DeleteModelStorage(modelToRemove);

            DbContext.Remove(modelToRemove);

            return null;
        }

    }
}