// -----------------------------------------------------------------------
// <copyright file="GetFileRequestHandler.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using System.IO;
    using System.Threading;
    using System.Threading.Tasks;
    using AutoMapper;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Errors;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Features.Settings;
    using ModelRelief.Services.Relationships;

    /// <summary>
    /// Represents the concrete handler for a GET single file request.
    /// </summary>
    /// <typeparam name="TEntity">Domain model.</typeparam>
    public class GetFileRequestHandler<TEntity>  : ValidatedHandler<GetFileRequest<TEntity>, FileContentResult>
        where TEntity   : DomainModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="GetFileRequestHandler{TEntity}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IWebHostEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="dependencyManager">Services for dependency processing.</param>
        /// <param name="settingsManager">Settings manager.</param>
        public GetFileRequestHandler(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IWebHostEnvironment hostingEnvironment,
            Services.IConfigurationProvider  configurationProvider,
            IDependencyManager dependencyManager,
            ISettingsManager settingsManager)
            : base(dbContext, loggerFactory, mapper, hostingEnvironment, configurationProvider, dependencyManager, settingsManager, null)
        {
        }

        /// <summary>
        /// Handles the Get single file request.
        /// </summary>
        /// <param name="message">Request message</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// https://stackoverflow.com/questions/42460198/return-file-in-asp-net-core-web-api
        public override async Task<FileContentResult> OnHandle(GetFileRequest<TEntity> message, CancellationToken cancellationToken)
        {
            // not a file-backed model?
            if (!typeof(FileDomainModel).IsAssignableFrom(typeof(TEntity)))
                throw new ModelNotBackedByFileException(typeof(TEntity));

            var domainModel = await Query.FindDomainModelAsync<TEntity>(message.User, message.Id, throwIfNotFound: true);
            var fileDomainModel = domainModel as FileDomainModel;

            var fileName = fileDomainModel.FileName;
            if (!File.Exists(fileName))
                throw new ModelFileNotFoundException(typeof(TEntity), domainModel.Name);

            var contents = File.ReadAllBytes(fileName);
#if true
            var response = new FileContentResult(contents, "application/json");
#else
            // WIP: When:
            //  1) The FileContentResult encoding is set to "application/octet-stream".
            //  2) The RestController GetFile action method has [Produces("application/octet-stream")].
            //  3) The client request header specifies "Accept : 'application/octet-stream'".
            //  The server returns HTTP status 406 "Not Acceptable" as though the requested format could not be matched to the client request.
            //  Is a CustomFormatter required?
            var response = new FileContentResult(contents, "application/octet-stream");
#endif

            return response;
        }
    }
}