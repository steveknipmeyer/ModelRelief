// -----------------------------------------------------------------------
// <copyright file="IQuery.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Utility
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Domain;
    using ModelRelief.Dto;

    public interface IQuery
    {
        Task<IQueryable<TEntity>> BuildQueryable<TEntity>(ClaimsPrincipal claimsPrincipal, int? id, GetQueryParameters queryParameters = null)
            where TEntity : DomainModel;
        IQueryable<TEntity> BuildQueryable<TEntity>(string userId, int? id, GetQueryParameters queryParameters = null)
            where TEntity : DomainModel;
        Task<TEntity> FindDomainModelAsync<TEntity>(ClaimsPrincipal claimsPrincipal, int? id, GetQueryParameters queryParameters = null, bool throwIfNotFound = true)
            where TEntity : DomainModel;
        Task<TEntity> FindDomainModelAsync<TEntity>(string userId, int? id, GetQueryParameters queryParameters = null, bool throwIfNotFound = true)
            where TEntity : DomainModel;
        Task<TGetModel> FindDtoModelAsync<TEntity, TGetModel>(ClaimsPrincipal claimsPrincipal, int? id, GetQueryParameters queryParameters = null, bool throwIfNotFound = true)
            where TEntity : DomainModel
            where TGetModel : IModel;
        Task<ICollection<TGetModel>> FindDtoModelsAsync<TEntity, TGetModel>(ClaimsPrincipal claimsPrincipal, GetQueryParameters queryParameters = null, bool throwIfNotFound = true)
            where TEntity : DomainModel
            where TGetModel : IModel;
        Task<bool> ModelExistsAsync<TEntity>(ClaimsPrincipal claimsPrincipal, int id)
            where TEntity : DomainModel;
        ICollection<TGetModel> ProjectAll<TEntity, TGetModel>(IQueryable<TEntity> domainQueryable, GetQueryParameters queryParameters = null)
            where TEntity : DomainModel
            where TGetModel : IModel;
        TGetModel ProjectSingle<TEntity, TGetModel>(IQueryable<TEntity> domainQueryable, GetQueryParameters queryParameters = null)
            where TEntity : DomainModel
            where TGetModel : IModel;
    }
}