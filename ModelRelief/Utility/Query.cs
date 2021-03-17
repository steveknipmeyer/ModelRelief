// -----------------------------------------------------------------------
// <copyright file="Query.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Utility
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using AutoMapper;
    using AutoMapper.QueryableExtensions;
    using FluentValidation;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Errors;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Dto;

    /// <summary>
    /// Utility support for database queries.
    /// </summary>
    public class Query
    {
        public ModelReliefDbContext DbContext { get; }
        public ILogger Logger { get; }
        public IMapper Mapper { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Query"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="loggerFactory">ILoggerFactory.</param>
        /// <param name="mapper">IMapper</param>
        public Query(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IMapper mapper)
        {
            DbContext = dbContext ?? throw new System.ArgumentNullException(nameof(dbContext));
            Logger = (loggerFactory == null) ? throw new System.ArgumentNullException(nameof(loggerFactory)) : loggerFactory.CreateLogger(typeof(Query).Name);
            Mapper = mapper ?? throw new System.ArgumentNullException(nameof(mapper));
        }

        /// <summary>
        /// Return the PropertyInfo for a (case-insensitive) property name.
        /// </summary>
        /// <param name="propertyName">Case-insensitive property name</param>
        /// <typeparam name="T">Class type</typeparam>
        /// <returns>PropertyInfo</returns>
        private PropertyInfo GetProperty<T>(string propertyName)
        {
            Type classType = typeof(T);
            PropertyInfo propertyInfo = classType.GetProperty(propertyName, BindingFlags.Instance | BindingFlags.Public | BindingFlags.IgnoreCase);
            return propertyInfo;
        }

        /// <summary>
        /// Project a domain IQueryable to a single TGetModel
        /// </summary>
        /// <param name="domainQueryable">Domain IQueryable</param>
        /// <param name="queryParameters">Query parameters</param>
        /// <typeparam name="TEntity">Domain type</typeparam>
        /// <typeparam name="TGetModel">DTO type</typeparam>
        /// <returns>Projected TGetModel</returns>
        public virtual TGetModel ProjectSingle<TEntity, TGetModel>(IQueryable<TEntity> domainQueryable, GetQueryParameters queryParameters = null)
            where TEntity : DomainModel
            where TGetModel : IModel
        {
            ICollection<TGetModel> projectedModels = ProjectAll<TEntity, TGetModel>(domainQueryable, queryParameters);
            return projectedModels.Single<TGetModel>();
        }

        /// <summary>
        /// Project a domain IQueryable to a collection of TGetModels
        /// </summary>
        /// <param name="domainQueryable">Domain IQueryable</param>
        /// <param name="queryParameters">Query parameters</param>
        /// <typeparam name="TEntity">Domain type</typeparam>
        /// <typeparam name="TGetModel">DTO type</typeparam>
        /// <returns>Collection of projected TGetModels</returns>
        public virtual ICollection<TGetModel> ProjectAll<TEntity, TGetModel>(IQueryable<TEntity> domainQueryable, GetQueryParameters queryParameters = null)
            where TEntity : DomainModel
            where TGetModel : IModel
        {
            ICollection<TGetModel> projectedModels = domainQueryable.ProjectTo<TGetModel>(Mapper.ConfigurationProvider).ToList<TGetModel>();
            if (queryParameters?.Relations == null)
                return projectedModels;

            // N.B. Collection navigation properties are explicitly populated below.
            // Collection navigation properties in models leads to AutoMapper ProjectTo hanging with extreme memory usage.
            // The properties must be marked [IgnoreMap] so ProjectTo skips them.
            //     [IgnoreMap]
            //     public ICollection<Model3d> Models { get; set; }
            foreach (var projectedModel in projectedModels)
            {
                try
                {
                    string[] relations = queryParameters.Relations.Split(',');
                    foreach (string relation in relations)
                    {
                        PropertyInfo domainProperty = GetProperty<TEntity>(relation);
                        PropertyInfo mappedProperty = GetProperty<TGetModel>(relation);
                        if ((domainProperty == null) || (mappedProperty == null))
                            continue;

                        var domainCollection = domainProperty.GetValue(domainQueryable.Where(m => m.Id == projectedModel.Id).Single());
                        var domainPropertyType = domainProperty.PropertyType;
                        var mappedPropertyType = mappedProperty.PropertyType;
                        if (domainCollection == null)
                        {
                            // empty List<mappedPropertyType>
                            var listType = typeof(List<>).MakeGenericType(mappedPropertyType);
                            mappedProperty.SetValue(projectedModel, Activator.CreateInstance(listType));
                            continue;
                        }

                        var mappedColleciton = Mapper.Map(domainCollection, domainPropertyType, mappedPropertyType);
                        mappedProperty.SetValue(projectedModel, mappedColleciton);
                    }
                }
                catch (Exception ex)
                {
                    Logger.LogError($"Error mapping collection: Type = {typeof(TEntity).Name}, {ex.Message}");
                }
            }
            return projectedModels;
        }

        /// <summary>
        /// Returns an IQueryable for a query.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="claimsPrincipal">Current HttpContext User.</param>
        /// <param name="id">Target id to retrieve.</param>
        /// <param name="queryParameters">Query parameters.</param>
        public virtual async Task<IQueryable<TEntity>> BuildQueryable<TEntity>(ClaimsPrincipal claimsPrincipal, int? id, GetQueryParameters queryParameters = null)
            where TEntity : DomainModel
        {
            var user = await IdentityUtility.FindApplicationUserAsync(claimsPrincipal);
            return BuildQueryable<TEntity>(user.Id, id, queryParameters);
        }

        /// <summary>
        /// Returns an IQueryable for a query.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="userId">ApplicationUser Id.</param>
        /// <param name="id">Target id to retrieve.</param>
        /// <param name="queryParameters">Query parameters.</param>
        public virtual IQueryable<TEntity> BuildQueryable<TEntity>(string userId, int? id, GetQueryParameters queryParameters = null)
            where TEntity : DomainModel
        {
            IQueryable<TEntity> queryable = DbContext.Set<TEntity>()
                                                     .Where(m => (m.UserId == userId));

            // query by Name?
            if (!string.IsNullOrEmpty(queryParameters?.Name ?? string.Empty))
                queryable = queryable.Where(m => EF.Functions.Like(m.Name, $"{queryParameters.Name}%"));
            else if (id != null)
                queryable = queryable.Where(m => (m.Id == id));

            if (queryParameters == null)
                return queryable;

            if (string.IsNullOrEmpty(queryParameters.Relations))
                return queryable;

            string[] relations = queryParameters.Relations.Split(',');
            foreach (string relation in relations)
            {
                PropertyInfo propertyInfo = GetProperty<TEntity>(relation);
                if (propertyInfo != null)
                    queryable = queryable.Include(propertyInfo.Name);
            }
            return queryable;
        }

        /// <summary>
        /// Returns the collection of TGetModels for a given query.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <typeparam name="TGetModel">DTO model.</typeparam>
        /// <param name="claimsPrincipal">Current HttpContext User.</param>
        /// <param name="queryParameters">Query parameters.</param>
        /// <param name="throwIfNotFound">Throw EntityNotFoundException if not found.</param>
        /// <returns>Collection of TGetModels.</returns>
        public virtual async Task<ICollection<TGetModel>> FindDtoModelsAsync<TEntity, TGetModel>(ClaimsPrincipal claimsPrincipal, GetQueryParameters queryParameters = null, bool throwIfNotFound = true)
            where TEntity : DomainModel
            where TGetModel : IModel
        {
            ICollection<TGetModel> projectedModels = null;
            int? multipleModels = null;
            try
            {
                IQueryable<TEntity> domainQueryable = await BuildQueryable<TEntity>(claimsPrincipal, multipleModels, queryParameters);
                projectedModels = ProjectAll<TEntity, TGetModel>(domainQueryable, queryParameters);
            }
            catch (Exception)
            {
                if (throwIfNotFound)
                    throw new EntityNotFoundException(typeof(TEntity), multipleModels);
            }
            return projectedModels;
        }

        /// <summary>
        /// Returns the DTO model for a given Id.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <typeparam name="TGetModel">DTO model.</typeparam>
        /// <param name="claimsPrincipal">Current HttpContext User.</param>
        /// <param name="id">Target id to retrieve.</param>
        /// <param name="queryParameters">Query parameters.</param>
        /// <param name="throwIfNotFound">Throw EntityNotFoundException if not found.</param>
        /// <returns>DTO model</returns>
        public virtual async Task<TGetModel> FindDtoModelAsync<TEntity, TGetModel>(ClaimsPrincipal claimsPrincipal, int? id, GetQueryParameters queryParameters = null, bool throwIfNotFound = true)
            where TEntity : DomainModel
            where TGetModel : IModel
        {
            TGetModel projectedModel = default(TGetModel);
            try
            {
                IQueryable<TEntity> domainQueryable = await BuildQueryable<TEntity>(claimsPrincipal, id, queryParameters);
                projectedModel = ProjectSingle<TEntity, TGetModel>(domainQueryable, queryParameters);
            }
            catch (Exception)
            {
                if (throwIfNotFound)
                    throw new EntityNotFoundException(typeof(TEntity), id);
            }
            return projectedModel;
        }

        /// <summary>
        /// Returns the domain model for a given Id.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="claimsPrincipal">Current HttpContext User.</param>
        /// <param name="id">Target id to retrieve.</param>
        /// <param name="queryParameters">Query parameters.</param>
        /// <param name="throwIfNotFound">Throw EntityNotFoundException if not found.</param>
        /// <returns>Domain model if exists, null otherwise.</returns>
        public virtual async Task<TEntity> FindDomainModelAsync<TEntity>(ClaimsPrincipal claimsPrincipal, int? id, GetQueryParameters queryParameters = null, bool throwIfNotFound = true)
            where TEntity : DomainModel
        {
            var user = await IdentityUtility.FindApplicationUserAsync(claimsPrincipal);
            return await FindDomainModelAsync<TEntity>(user.Id, id, queryParameters, throwIfNotFound);
        }

        /// <summary>
        /// Returns the domain model for a given Id.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="userId">ApplicationUser Id.</param>
        /// <param name="id">Target id to retrieve.</param>
        /// <param name="queryParameters">Query parameters.</param>
        /// <param name="throwIfNotFound">Throw EntityNotFoundException if not found.</param>
        /// <returns>Domain model if exists, null otherwise.</returns>
        public virtual async Task<TEntity> FindDomainModelAsync<TEntity>(string userId, int? id, GetQueryParameters queryParameters = null, bool throwIfNotFound = true)
            where TEntity : DomainModel
        {
            var queryable = BuildQueryable<TEntity>(userId, id, queryParameters);

            TEntity domainModel = null;
            try
            {
                domainModel = await queryable.SingleAsync();
            }
            catch (Exception)
            {
                if (throwIfNotFound)
                    throw new EntityNotFoundException(typeof(TEntity), id);
            }
            return domainModel;
        }

        /// <summary>
        /// Returns true if the domain model exists for a given Id.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="claimsPrincipal">Current HttpContext User.</param>
        /// <param name="id">Target id to test.</param>
        /// <returns>True if model exists.</returns>
        public virtual async Task<bool> ModelExistsAsync<TEntity>(ClaimsPrincipal claimsPrincipal, int id)
            where TEntity : DomainModel
        {
            var domainModel = await FindDomainModelAsync<TEntity>(claimsPrincipal, id, throwIfNotFound: false);
            return domainModel != null;
        }
    }
}