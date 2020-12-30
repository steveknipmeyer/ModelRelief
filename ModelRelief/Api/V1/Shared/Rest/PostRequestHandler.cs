﻿// -----------------------------------------------------------------------
// <copyright file="PostRequestHandler.cs" company="ModelRelief">
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
    /// Represents a handler for a POST request to create a new model.
    /// </summary>
    /// <typeparam name="TEntity">Domain model</typeparam>
    /// <typeparam name="TRequestModel">DTO POST model.</typeparam>
    /// <typeparam name="TGetModel">DTO GET model.</typeparam>
    public class PostRequestHandler<TEntity, TRequestModel, TGetModel> : ValidatedHandler<PostRequest<TEntity, TRequestModel, TGetModel>, TGetModel>
        where TEntity    : DomainModel
        where TGetModel  : IModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="PostRequestHandler{TEntity, TRequestModel, TGetModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IWebHostEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="dependencyManager">Services for dependency processing.</param>
        /// <param name="validators">All validators matching IValidator for the given request.</param>
        public PostRequestHandler(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IWebHostEnvironment hostingEnvironment,
            Services.IConfigurationProvider  configurationProvider,
            IDependencyManager dependencyManager,
            IEnumerable<IValidator<PostRequest<TEntity, TRequestModel, TGetModel>>> validators)
            : base(dbContext, loggerFactory, mapper, hostingEnvironment, configurationProvider, dependencyManager, validators)
        {
        }

        /// <summary>
        /// Handles a POST model request.
        /// </summary>
        /// <param name="message">POST request.</param>
        /// <param name="cancellationToken">Token to allow the async operation to be cancelled.</param>
        /// <returns>TGetModel for model</returns>
        public override async Task<TGetModel> OnHandle(PostRequest<TEntity, TRequestModel, TGetModel> message, CancellationToken cancellationToken)
        {
            var newModel = Mapper.Map<TEntity>(message.NewModel);

             // validate all references are owned
            await ValidateReferences<TEntity>(newModel, message.User);

            // set ownership
            var applicationUser = await IdentityUtility.FindApplicationUserAsync(message.User);
            newModel.UserId = applicationUser.Id;

            DbContext.Set<TEntity>().Add(newModel);
            await DependencyManager.PersistChangesAsync(newModel, cancellationToken);

            // N.B. ProjectTo populates all navigation properties.
            //      Mapper.Map<TGetModel>(newModel) would return only the primary model.
            IQueryable<TEntity> model = DbContext.Set<TEntity>()
                                            .Where(m => (m.Id == newModel.Id));
            var projectedModel = model.ProjectTo<TGetModel>(Mapper.ConfigurationProvider).Single();

            return projectedModel;
        }
    }
}