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
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
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
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="dependencyManager">Services for dependency processing.</param>
        /// <param name="validators">All validators matching IValidator for the given request.</param>
        public PutRequestHandler(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IHostingEnvironment hostingEnvironment,
            Services.IConfigurationProvider  configurationProvider,
            IDependencyManager dependencyManager,
            IEnumerable<IValidator<PutRequest<TEntity, TRequestModel, TGetModel>>> validators)
            : base(dbContext, loggerFactory, mapper, hostingEnvironment, configurationProvider, dependencyManager, validators)
        {
        }

        /// <summary>
        /// Handles a PUT model request.
        /// </summary>
        /// <param name="message">PUT request.</param>
        /// <param name="cancellationToken">Token to allow the async operation to be cancelled.</param>
        /// <returns></returns>
        public override async Task<TGetModel> OnHandle(PutRequest<TEntity, TRequestModel, TGetModel> message, CancellationToken cancellationToken)
        {
            var targetModel = await FindModelAsync<TEntity>(message.User, message.Id);

            // stop tracking to avoid conflicting tracking with updatedModel
            DbContext.Entry(targetModel).State = EntityState.Detached;

            // update domain model
            var updatedModel = Mapper.Map<TRequestModel, TEntity>(message.UpdatedModel, targetModel);

            // validate all references are owned
            await ValidateReferences<TEntity>(updatedModel, message.User);

            // ensure Id is set; PutModel may not have included the Id but it is always present in the PutRequest.
            updatedModel.Id = message.Id;

            // set ownership
            var applicationUser = await IdentityUtility.FindApplicationUserAsync(message.User);
            updatedModel.UserId = applicationUser.Id;

            DbContext.Set<TEntity>().Update(updatedModel);
            await DependencyManager.PersistChangesAsync(updatedModel, cancellationToken);

            // fully populate return model
            IQueryable<TEntity> model = DbContext.Set<TEntity>()
                                            .Where(m => (m.Id == updatedModel.Id));
            var projectedModel = model.ProjectTo<TGetModel>(Mapper.ConfigurationProvider).Single();

            return projectedModel;
        }
    }
}