// -----------------------------------------------------------------------
// <copyright file="GetListRequestHandler.cs" company="ModelRelief">
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
    using Microsoft.AspNetCore.Identity;
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
    /// Represents a handler for a GET request for a collection of models.
    /// </summary>
    /// <typeparam name="TEntity">Domain model</typeparam>
    /// <typeparam name="TGetModel">DTO model.</typeparam>
    public class GetListRequestHandler<TEntity, TGetModel> : ValidatedHandler<GetListRequest<TEntity, TGetModel>, object>
        where TEntity   : DomainModel
        where TGetModel : IModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="GetListRequestHandler{TEntity, TGetModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="userManager">UserManager (ClaimsPrincipal -> ApplicationUser).</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="dependencyManager">Services for dependency processing.</param>
        public GetListRequestHandler(
            ModelReliefDbContext dbContext,
            UserManager<ApplicationUser> userManager,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IHostingEnvironment hostingEnvironment,
            Services.IConfigurationProvider  configurationProvider,
            IDependencyManager dependencyManager)
            : base(dbContext, userManager, loggerFactory, mapper, hostingEnvironment, configurationProvider, dependencyManager, null)
        {
        }

        /// <summary>
        /// Handles a GetListRequest, paging if needed.
        /// </summary>
        /// <param name="message">GetListRequest.</param>
        /// <param name="cancellationToken">Token to allow the async operation to be cancelled.</param>
        /// <returns></returns>
        public override async Task<object> OnHandle(GetListRequest<TEntity, TGetModel> message, CancellationToken cancellationToken)
        {
            var user = await IdentityUtility.FindApplicationUserAsync(UserManager, message.User);

            IQueryable<TEntity> results = DbContext.Set<TEntity>()
                                                .Where(m => (m.UserId == user.Id));

            if (message.UsePaging)
            {
                var page = await CreatePagedResultsAsync<TEntity, TGetModel>(results, message.UrlHelperContainer, message.PageNumber, message.NumberOfRecords, message.OrderBy, message.Ascending);
                return page;
            }

            return await results.ProjectTo<TGetModel>(Mapper.ConfigurationProvider).ToArrayAsync();
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
        protected async Task<PagedResults<TReturn>> CreatePagedResultsAsync<T, TReturn>(
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

            var totalNumberOfRecords = await queryable.CountAsync();
            var results = await projection.ToListAsync();

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