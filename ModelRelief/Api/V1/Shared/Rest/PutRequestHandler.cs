// -----------------------------------------------------------------------
// <copyright file="PutRequestHandler.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using AutoMapper;
    using AutoMapper.QueryableExtensions;
    using FluentValidation;
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
    /// Represents a handler for a PUT request to update an existing model.
    /// </summary>
    /// <remarks>All properties are updated.</remarks>
    /// <typeparam name="TEntity">Domain model</typeparam>
    /// <typeparam name="TRequestModel">DTO PUT model.</typeparam>
    /// <typeparam name="TGetModel">DTO GET model.</typeparam>
    public class PutRequestHandler<TEntity, TRequestModel, TGetModel> : ValidatedHandler<PutRequest<TEntity, TRequestModel, TGetModel>, TGetModel>
        where TEntity    : DomainModel
        where TGetModel  : IModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="PutRequestHandler{TEntity, TRequestModel, TGetModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IWebHostEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="dependencyManager">Services for dependency processing.</param>
        /// <param name="validators">All validators matching IValidator for the given request.</param>
        /// <param name="settingsManager">ISettingsManager</param>
        /// <param name="query">IQuery</param>
        /// <param name="modelReferenceValidator">IModelReferenceValidator</param>
        public PutRequestHandler(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IWebHostEnvironment hostingEnvironment,
            Services.IConfigurationProvider  configurationProvider,
            IDependencyManager dependencyManager,
            IEnumerable<IValidator<PutRequest<TEntity, TRequestModel, TGetModel>>> validators,
            ISettingsManager settingsManager,
            IQuery query,
            IModelReferenceValidator modelReferenceValidator)
            : base(dbContext, loggerFactory, mapper, hostingEnvironment, configurationProvider, dependencyManager, validators, settingsManager, query, modelReferenceValidator)
        {
        }

        /// <summary>
        /// Handles a PUT model request.
        /// </summary>
        /// <param name="message">PUT request.</param>
        /// <param name="cancellationToken">Token to allow the async operation to be cancelled.</param>
        /// <returns>TGetModel for model0</returns>
        public override async Task<TGetModel> OnHandle(PutRequest<TEntity, TRequestModel, TGetModel> message, CancellationToken cancellationToken)
        {
            var targetModel = await Query.FindDomainModelAsync<TEntity>(message.User, message.Id);

            // update domain model
            targetModel = Mapper.Map<TRequestModel, TEntity>(message.UpdatedModel, targetModel);

            // validate all references are owned
            await ReferenceValidator.ValidateAsync<TEntity>(targetModel, message.User);

            // ensure Id is set; PutModel may not have included the Id but it is always present in the PutRequest.
            targetModel.Id = message.Id;

            // set ownership
            var applicationUser = await IdentityUtility.FindApplicationUserAsync(message.User);
            targetModel.UserId = applicationUser.Id;

            DbContext.Set<TEntity>().Update(targetModel);
            await DependencyManager.PersistChangesAsync(targetModel, cancellationToken);

            var projectedModel = await Query.FindDtoModelAsync<TEntity, TGetModel>(message.User, message.Id);
            return projectedModel;
        }
    }
}