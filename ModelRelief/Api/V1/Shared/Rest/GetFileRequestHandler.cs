// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ModelRelief.Api.V1.Shared.Errors;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Services;
using ModelRelief.Utility;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    /// Represents the concrete handler for a GET single file request.
    /// </summary>
    /// <typeparam name="TEntity">Domain model.</typeparam>
    public class GetFileRequestHandler<TEntity>  : ValidatedHandler<GetFileRequest<TEntity>, FileContentResult>
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
        /// <param name="dependencyManager">Services for dependency processing.</param>
        /// <param name="logger">ILogger.</param>
       public GetFileRequestHandler(UserManager<ApplicationUser> userManager, ModelReliefDbContext dbContext, IMapper mapper, IHostingEnvironment hostingEnvironment, Services.IConfigurationProvider  configurationProvider, IDependencyManager dependencyManager, ILogger<TEntity> logger)
            : base(userManager, dbContext, mapper, hostingEnvironment, configurationProvider, dependencyManager, null)
        {
            Logger = logger;
        }

        /// <summary>
        /// Handles the Get single file request.
        /// </summary>
        /// <param name="message">Request message</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// https://stackoverflow.com/questions/42460198/return-file-in-asp-net-core-web-api
        /// <returns></returns>
        public override async Task<FileContentResult> OnHandle(GetFileRequest<TEntity> message, CancellationToken cancellationToken)
        {
            // not a file-backed model?
            if (!typeof(FileDomainModel).IsAssignableFrom(typeof(TEntity)))
                throw new ModelNotBackedByFileException(typeof(TEntity));

            var domainModel = await FindModelAsync<TEntity>(message.User, message.Id, throwIfNotFound: true);
            var fileDomainModel = domainModel as FileDomainModel;

            var fileName = fileDomainModel.FileName;
            if (!File.Exists(fileName))
                throw new ModelFileNotFoundException(typeof(TEntity), domainModel.Name);

            var contents = File.ReadAllBytes(fileName);
            var response = new FileContentResult(contents, "application/json"); 

            return response;
        }
    }
}