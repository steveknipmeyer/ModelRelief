// -----------------------------------------------------------------------
// <copyright file="GetSingleRequestHandler.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using System.Globalization;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using AutoMapper;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
    using ModelRelief.Features.Settings;
    using ModelRelief.Services.Relationships;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents the concrete handler for a GET single model request.
    /// </summary>
    /// <typeparam name="TEntity">Domain model.</typeparam>
    /// <typeparam name="TGetModel">DTO Get model.</typeparam>
    public class GetSingleRequestHandler<TEntity, TGetModel>  : ValidatedHandler<GetSingleRequest<TEntity, TGetModel>, TGetModel>
        where TEntity   : DomainModel
        where TGetModel : IModel, new()
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="GetSingleRequestHandler{TEntity, TGetModel}"/> class.
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
        public GetSingleRequestHandler(
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
        /// Handles the Get single model request.
        /// </summary>
        /// <param name="message">Request message</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// <returns>TGetModel for request</returns>
        public override async Task<TGetModel> OnHandle(GetSingleRequest<TEntity, TGetModel> message, CancellationToken cancellationToken)
        {
            var projectedModel = await Query.FindDtoModelAsync<TEntity, TGetModel>(message.User, message.Id, message.QueryParameters);
            return projectedModel;
        }
    }
}