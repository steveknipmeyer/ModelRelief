// -----------------------------------------------------------------------
// <copyright file="GetMultipleRequestHandler.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using AutoMapper;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Extensions;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
    using ModelRelief.Features.Settings;
    using ModelRelief.Infrastructure;
    using ModelRelief.Services.Relationships;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents a handler for a GET query request for a collection of models.
    /// </summary>
    /// <typeparam name="TEntity">Domain model</typeparam>
    /// <typeparam name="TGetModel">DTO model.</typeparam>
    public class GetMultipleRequestHandler<TEntity, TGetModel> : ValidatedHandler<GetMultipleRequest<TEntity, TGetModel>, object>
        where TEntity   : DomainModel
        where TGetModel : IModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="GetMultipleRequestHandler{TEntity, TGetModel}"/> class.
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
        public GetMultipleRequestHandler(
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
        /// Handles a GetListRequest, paging if needed.
        /// </summary>
        /// <param name="request">GetListRequest.</param>
        /// <param name="cancellationToken">Token to allow the async operation to be cancelled.</param>
        public override async Task<object> OnHandle(GetMultipleRequest<TEntity, TGetModel> request, CancellationToken cancellationToken)
        {
            var applicationUser = await request.ApplicationUserAsync();
            int? multipleModels = null;
            IQueryable<TEntity> queryable = Query.BuildQueryable<TEntity>(applicationUser.Id, multipleModels, request.QueryParameters);

            if (request.UsePaging)
            {
                var page = CreatePagedResultsAsync(queryable, request.UrlHelperContainer, request.PageNumber, request.NumberOfRecords, request.OrderBy, request.Ascending, request.QueryParameters);
                return page;
            }

            return Query.ProjectAll<TEntity, TGetModel>(queryable, request.QueryParameters);
        }

        /// <summary>
        /// Creates a paged set of results.
        /// </summary>
        /// <param name="queryable">The source IQueryable.</param>
        /// <param name="urlHelperContainer">IUrlHelper to construct paging links (from active controller)</param>
        /// <param name="pageNumber">The page number you want to retrieve.</param>
        /// <param name="pageSize">The size of the page.</param>
        /// <param name="orderBy">The field or property to order by.</param>
        /// <param name="ascending">Indicates whether or not the order should be ascending (true) or descending (false.)</param>
        /// <param name="queryParameters">Optional query parameters</param>
        /// <returns>Returns a paged set of results.</returns>
        protected PagedResults<TGetModel> CreatePagedResultsAsync(
            IQueryable<TEntity> queryable,
            IUrlHelperContainer urlHelperContainer,
            int pageNumber,
            int pageSize,
            string orderBy,
            bool ascending,
            GetQueryParameters queryParameters)
        {
            var skipAmount = pageSize * (pageNumber - 1);

            queryable = queryable
                .OrderByPropertyOrField(orderBy, ascending)
                .Skip(skipAmount)
                .Take(pageSize);

            var projectiion = Query.ProjectAll<TEntity, TGetModel>(queryable, queryParameters);
            var totalNumberOfRecords = queryable.Count();

            if (pageSize == -1)
                pageSize = totalNumberOfRecords;
            var mod = totalNumberOfRecords % pageSize;
            var totalPageCount = (totalNumberOfRecords / pageSize) + (mod == 0 ? 0 : 1);

            var nextPageUrl =
                pageNumber == totalPageCount
                    ? null
                    : urlHelperContainer.Url?.Link(
                        RouteNames.DefaultApiV1,
                        new { pageNumber = pageNumber + 1, pageSize, orderBy, ascending });

            return new PagedResults<TGetModel>
            {
                Results = projectiion,
                PageNumber = pageNumber,
                PageSize = projectiion.Count,
                TotalNumberOfPages = totalPageCount,
                TotalNumberOfRecords = totalNumberOfRecords,
                NextPageUrl = nextPageUrl,
            };
        }
    }
}