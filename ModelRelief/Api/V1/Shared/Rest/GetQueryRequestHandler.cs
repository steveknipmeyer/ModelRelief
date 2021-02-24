// -----------------------------------------------------------------------
// <copyright file="GetQueryRequestHandler.cs" company="ModelRelief">
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
    using AutoMapper.QueryableExtensions;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Extensions;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
    using ModelRelief.Infrastructure;
    using ModelRelief.Services.Relationships;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents a handler for a GET query request for a collection of models.
    /// </summary>
    /// <typeparam name="TEntity">Domain model</typeparam>
    /// <typeparam name="TGetModel">DTO model.</typeparam>
    public class GetQueryRequestHandler<TEntity, TGetModel> : ValidatedHandler<GetQueryRequest<TEntity, TGetModel>, object>
        where TEntity   : DomainModel
        where TGetModel : IModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="GetQueryRequestHandler{TEntity, TGetModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IWebHostEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="dependencyManager">Services for dependency processing.</param>
        public GetQueryRequestHandler(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IWebHostEnvironment hostingEnvironment,
            Services.IConfigurationProvider  configurationProvider,
            IDependencyManager dependencyManager)
            : base(dbContext, loggerFactory, mapper, hostingEnvironment, configurationProvider, dependencyManager, null)
        {
        }

        /// <summary>
        /// Handles a GetListRequest, paging if needed.
        /// </summary>
        /// <param name="message">GetListRequest.</param>
        /// <param name="cancellationToken">Token to allow the async operation to be cancelled.</param>
        public override async Task<object> OnHandle(GetQueryRequest<TEntity, TGetModel> message, CancellationToken cancellationToken)
        {
            var user = await IdentityUtility.FindApplicationUserAsync(message.User);

            string matchPattern = string.IsNullOrEmpty(message.QueryParameters.Name) ? "%" : $"{message.QueryParameters.Name}%";
            IQueryable<TEntity> results = DbContext.Set<TEntity>()
                                            .Where(m => (m.UserId == user.Id))
                                            .Where(m => EF.Functions.Like(m.Name, matchPattern));

            if (message.UsePaging)
            {
                var page = CreatePagedResultsAsync<TEntity, TGetModel>(results, message.UrlHelperContainer, message.PageNumber, message.NumberOfRecords, message.OrderBy, message.Ascending);
                return page;
            }

            return results.ProjectTo<TGetModel>(Mapper.ConfigurationProvider).ToArray();
        }

        /// <summary>
        /// Creates a paged set of results.
        /// </summary>
        /// <typeparam name="T">The type of the source IQueryable.</typeparam>
        /// <typeparam name="TReturn">The type of the returned paged results.</typeparam>
        /// <param name="queryable">The source IQueryable.</param>
        /// <param name="urlHelperContainer">IUrlHelper to construct paging links (from active controller)</param>
        /// <param name="pageNumber">The page number you want to retrieve.</param>
        /// <param name="pageSize">The size of the page.</param>
        /// <param name="orderBy">The field or property to order by.</param>
        /// <param name="ascending">Indicates whether or not the order should be ascending (true) or descending (false.)</param>
        /// <returns>Returns a paged set of results.</returns>
        protected PagedResults<TReturn> CreatePagedResultsAsync<T, TReturn>(
            IQueryable<T> queryable,
            IUrlHelperContainer urlHelperContainer,
            int pageNumber,
            int pageSize,
            string orderBy,
            bool ascending)
        {
            var skipAmount = pageSize * (pageNumber - 1);

            var projection = queryable
                .OrderByPropertyOrField(orderBy, ascending)
                .Skip(skipAmount)
                .Take(pageSize)
                .ProjectTo<TReturn>(Mapper.ConfigurationProvider);

            var totalNumberOfRecords = queryable.Count();
            var results = projection.ToList();

            var mod = totalNumberOfRecords % pageSize;
            var totalPageCount = (totalNumberOfRecords / pageSize) + (mod == 0 ? 0 : 1);

            var nextPageUrl =
                pageNumber == totalPageCount
                    ? null
                    : urlHelperContainer.Url?.Link(
                        RouteNames.DefaultApiV1,
                        new { pageNumber = pageNumber + 1, pageSize, orderBy, ascending });

            return new PagedResults<TReturn>
            {
                Results = results,
                PageNumber = pageNumber,
                PageSize = results.Count,
                TotalNumberOfPages = totalPageCount,
                TotalNumberOfRecords = totalNumberOfRecords,
                NextPageUrl = nextPageUrl,
            };
        }
    }
}