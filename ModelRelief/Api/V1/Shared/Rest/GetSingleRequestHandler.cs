// -----------------------------------------------------------------------
// <copyright file="GetSingleRequestHandler.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using AutoMapper;
    using AutoMapper.QueryableExtensions;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
    using ModelRelief.Services.Relationships;

    /// <summary>
    /// Represents the concrete handler for a GET single model request.
    /// </summary>
    /// <typeparam name="TEntity">Domain model.</typeparam>
    /// <typeparam name="TGetModel">DTO Get model.</typeparam>
    public class GetSingleRequestHandler<TEntity, TGetModel>  : ValidatedHandler<GetSingleRequest<TEntity, TGetModel>, TGetModel>
        where TEntity   : DomainModel
        where TGetModel : IModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="GetSingleRequestHandler{TEntity, TGetModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="dependencyManager">Services for dependency processing.</param>
        public GetSingleRequestHandler(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IHostingEnvironment hostingEnvironment,
            Services.IConfigurationProvider  configurationProvider,
            IDependencyManager dependencyManager)
            : base(dbContext, loggerFactory, mapper, hostingEnvironment, configurationProvider, dependencyManager, null)
        {
        }

        /// <summary>
        /// Handles the Get single model request.
        /// </summary>
        /// <param name="message">Request message</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// <returns></returns>
        public override async Task<TGetModel> OnHandle(GetSingleRequest<TEntity, TGetModel> message, CancellationToken cancellationToken)
        {
            var targetModel = await FindModelAsync<TEntity>(message.User, message.Id);

            // stop tracking to avoid conflicting tracking with updatedModel
            DbContext.Entry(targetModel).State = EntityState.Detached;

            // fully populate return model
            IQueryable<TEntity> model = DbContext.Set<TEntity>()
                                            .Where(m => (m.Id == message.Id));
            var projectedModel = model.ProjectTo<TGetModel>(Mapper.ConfigurationProvider).Single();

            return projectedModel;
        }
    }
}