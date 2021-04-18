// -----------------------------------------------------------------------
// <copyright file="GetFileRequestHandler.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using System.IO;
    using System.Net.Mime;
    using System.Threading;
    using System.Threading.Tasks;
    using AutoMapper;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Errors;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Features.Settings;
    using ModelRelief.Services.Relationships;
    using ModelRelief.Utility;

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
        /// <param name="settingsManager">ISettingsManager</param>
        /// <param name="query">IQuery</param>
        /// <param name="modelReferenceValidator">IModelReferenceValidator</param>
        public GetFileRequestHandler(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IWebHostEnvironment hostingEnvironment,
            Services.IConfigurationProvider  configurationProvider,
            IDependencyManager dependencyManager,
            ISettingsManager settingsManager,
            IQuery query,
            IModelReferenceValidator modelReferenceValidator)
            : base(dbContext, loggerFactory, mapper, hostingEnvironment, configurationProvider, dependencyManager, null, settingsManager, query, modelReferenceValidator)
        {
        }

        /// <summary>
        /// Handles the Get single file request.
        /// </summary>
        /// <param name="request">Request</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// https://stackoverflow.com/questions/42460198/return-file-in-asp-net-core-web-api
        public override async Task<FileContentResult> OnHandle(GetFileRequest<TEntity> request, CancellationToken cancellationToken)
        {
            // not a file-backed model?
            if (!typeof(FileDomainModel).IsAssignableFrom(typeof(TEntity)))
                throw new ModelNotBackedByFileException(typeof(TEntity));

            var domainModel = await Query.FindDomainModelAsync<TEntity>(request.User, request.Id, throwIfNotFound: true);
            var fileDomainModel = domainModel as FileDomainModel;

            var fileName = string.Empty;
            var mediaType = MediaTypeNames.Application.Octet;

            switch ((request.QueryParameters.Extension ?? string.Empty).ToLower())
            {
                case "png":
                    fileName = fileDomainModel.PreviewFileName;
                    mediaType = "image/png";
                    break;

                case "obj":
                    fileName = fileDomainModel.ConstructFileName("obj");
                    break;

                default:
                    fileName = fileDomainModel.FileName;
                    break;
            }
            var baseFileName = Path.GetFileName(fileName);

            if (!File.Exists(fileName))
                throw new ModelFileNotFoundException(typeof(TEntity), baseFileName);

            var contents = File.ReadAllBytes(fileName);
            var response = new FileContentResult(contents, mediaType);
            response.FileDownloadName = baseFileName;

            return response;
        }
    }
}