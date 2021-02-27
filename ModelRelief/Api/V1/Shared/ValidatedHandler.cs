// -----------------------------------------------------------------------
// <copyright file="ValidatedHandler.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Security.Claims;
    using System.Threading;
    using System.Threading.Tasks;
    using AutoMapper;
    using AutoMapper.QueryableExtensions;
    using FluentValidation;
    using FluentValidation.Results;
    using MediatR;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Errors;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
    using ModelRelief.Services.Relationships;
    using ModelRelief.Utility;

    /// <summary>
    /// Abstract representation of request handler that supports validation.
    /// </summary>
    /// <typeparam name="TRequest">Request object.</typeparam>
    /// <typeparam name="TResponse">Response object.</typeparam>
    public abstract class ValidatedHandler<TRequest, TResponse> : IRequestHandler<TRequest, TResponse>
        where TRequest : IRequest<TResponse>
    {
        public ModelReliefDbContext             DbContext { get; }
        public ILogger                          Logger { get; }
        public IMapper                          Mapper { get; }
        public IWebHostEnvironment              HostingEnvironment { get; }
        public Services.IConfigurationProvider  ConfigurationProvider { get; }
        public IDependencyManager               DependencyManager { get; }
        public IEnumerable<IValidator<TRequest>> Validators { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ValidatedHandler{TRequest, TResponse}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IWebHostEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="dependencyManager">Services for dependency processing.</param>
        /// <param name="validators">List of validators</param>
        public ValidatedHandler(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IWebHostEnvironment hostingEnvironment,
            Services.IConfigurationProvider configurationProvider,
            IDependencyManager dependencyManager,
            IEnumerable<IValidator<TRequest>> validators)
        {
            DbContext =             dbContext ?? throw new System.ArgumentNullException(nameof(dbContext));
            Logger =                (loggerFactory == null) ? throw new System.ArgumentNullException(nameof(loggerFactory)) : loggerFactory.CreateLogger(typeof(ValidatedHandler<TRequest, TResponse>).Name);
            Mapper =                mapper ?? throw new System.ArgumentNullException(nameof(mapper));
            HostingEnvironment =    hostingEnvironment ?? throw new System.ArgumentNullException(nameof(hostingEnvironment));
            ConfigurationProvider = configurationProvider ?? throw new System.ArgumentNullException(nameof(configurationProvider));
            DependencyManager =     dependencyManager ?? throw new System.ArgumentNullException(nameof(dependencyManager));

            // WIP Why are duplicate validators injected here?
            //     Remove duplicates by grouping by Type name.
            Validators = validators?
                .GroupBy(v => v.GetType().Name)
                .Select(group => group.First());
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
            return projectedModels.First<TGetModel>();
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
        public virtual async Task<IQueryable<TEntity>> BuildQueryable<TEntity>(ClaimsPrincipal claimsPrincipal, int id, GetQueryParameters queryParameters = null)
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
        public virtual IQueryable<TEntity> BuildQueryable<TEntity>(string userId, int id, GetQueryParameters queryParameters = null)
            where TEntity : DomainModel
        {
            IQueryable<TEntity> queryable = DbContext.Set<TEntity>()
                                                     .Where(m => (m.UserId == userId));

            // query by Name?
            if (!string.IsNullOrEmpty(queryParameters?.Name ?? string.Empty))
                queryable = queryable.Where(m => EF.Functions.Like(m.Name, $"{queryParameters.Name}%"));
            else if (id >= 0)
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
        public virtual async Task<ICollection<TGetModel>> FindModelsAsync<TEntity, TGetModel>(ClaimsPrincipal claimsPrincipal, GetQueryParameters queryParameters = null, bool throwIfNotFound = true)
            where TEntity : DomainModel
            where TGetModel : IModel
        {
            ICollection<TGetModel> projectedModels = null;
            int allMNodelsId = -1;
            try
            {
                IQueryable<TEntity> domainQueryable = await BuildQueryable<TEntity>(claimsPrincipal, allMNodelsId, queryParameters);
                projectedModels = ProjectAll<TEntity, TGetModel>(domainQueryable, queryParameters);
            }
            catch (Exception)
            {
                if (throwIfNotFound)
                    throw new EntityNotFoundException(typeof(TEntity), allMNodelsId);
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
        public virtual async Task<TGetModel> FindModelAsync<TEntity, TGetModel>(ClaimsPrincipal claimsPrincipal, int id, GetQueryParameters queryParameters = null, bool throwIfNotFound = true)
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
        public virtual async Task<TEntity> FindModelAsync<TEntity>(ClaimsPrincipal claimsPrincipal, int id, GetQueryParameters queryParameters = null, bool throwIfNotFound = true)
            where TEntity : DomainModel
        {
            var user = await IdentityUtility.FindApplicationUserAsync(claimsPrincipal);
            return await FindModelAsync<TEntity>(user.Id, id, queryParameters, throwIfNotFound);
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
        public virtual async Task<TEntity> FindModelAsync<TEntity>(string userId, int id, GetQueryParameters queryParameters = null, bool throwIfNotFound = true)
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
            var domainModel = await FindModelAsync<TEntity>(claimsPrincipal, id, throwIfNotFound: false);
            return domainModel != null;
        }

        /// <summary>
        /// Validated the property references of the given model to ensure they exist and are owned by the active user.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="model">Model to validate.</param>
        /// <param name="claimsPrincipal">Active user for this request.</param>
        public async Task ValidateReferences<TEntity>(TEntity model, ClaimsPrincipal claimsPrincipal)
            where TEntity : DomainModel
        {
            var validationFailures = new List<ValidationFailure>();

            Type type = model.GetType();
            PropertyInfo[] properties = type.GetProperties();
            foreach (PropertyInfo property in properties)
            {
                // skip read-only properties (e.g. calculated FileDomainModel properties)
                if (!property.CanWrite)
                    continue;

                var propertyName  = property.Name;
                var propertyValue = property.GetValue(model, null);

                if (propertyName == "Id")
                    continue;
                if (propertyValue == null)
                    continue;

                // foreign key?
                if (!propertyName.EndsWith("Id"))
                    continue;

                // find actual reference property
                var referencePropertyName = propertyName.Substring(0, propertyName.LastIndexOf("Id"));
                var referenceType         = type.GetProperty(referencePropertyName)?.PropertyType;

                if (referenceType == null)
                    continue;

                // Console.WriteLine("Verifying reference property: " + propertyName + ", Value: " + propertyValue, null);
                switch (referenceType.Name)
                {
                    case nameof(ApplicationUser):
                        // ModelExistsAsync requires the primary key to be an integer.
                        continue;

                    default:
                        break;
                }

                // https://stackoverflow.com/questions/4101784/calling-a-generic-method-with-a-dynamic-type
                // https://stackoverflow.com/questions/16153047/net-invoke-async-method-and-await
                var method = typeof(ValidatedHandler<TRequest, TResponse>).GetMethod(nameof(ModelExistsAsync)).MakeGenericMethod(referenceType);
                var modelExists = await (Task<bool>)method.Invoke(this, new object[] { claimsPrincipal, (int)propertyValue });
                if (!modelExists)
                    validationFailures.Add(new ValidationFailure(propertyName, $"Property '{propertyName}' references an entity that does not exist."));
            }

            if (validationFailures.Count() > 0)
            {
                // package TRequest type with FV ValidationException
                throw new ApiValidationException(typeof(TRequest), validationFailures);
            }
        }

        /// <summary>
        /// Abstract pre-handler; performns any initialization or setup required before the request is handled.
        /// </summary>
        /// <param name="message">Request object</param>
        /// <param name="cancellationToken">Token to allow asyn request to be cancelled.</param>
        /// <returns>Task</returns>
        public virtual async Task PreHandle(TRequest message, CancellationToken cancellationToken)
        {
            await Task.CompletedTask;
        }

        /// <summary>
        /// Validation pre-processor for request.
        /// </summary>
        /// <param name="message">Request object</param>
        /// <param name="cancellationToken">Token to allow asyn request to be cancelled.</param>
        public async Task<TResponse> Handle(TRequest message, CancellationToken cancellationToken)
        {
            // perform any setup required before validation
            await PreHandle(message, cancellationToken);

            // All request validators will run through here first before moving onto the OnHandle request.
            if (Validators != null)
            {
                // WIP Exactly how does this LINQ produce a list of errors?
                var validationResult = (await Task.WhenAll(Validators
                    .Where(v => v != null)
                    .Select(v => v.ValidateAsync(message))))
                    .SelectMany(v => v.Errors);

                if (validationResult.Any())
                {
                    // package TRequest type with FV ValidationException
                    throw new ApiValidationException(typeof(TRequest), validationResult);
                }
            }
            return await OnHandle(message, cancellationToken);
        }

        /// <summary>
        /// Abstract request handler; implemented in concrete class.
        /// </summary>
        /// <param name="message">Request object</param>
        /// <param name="cancellationToken">Token to allow asyn request to be cancelled.</param>
        public abstract Task<TResponse> OnHandle(TRequest message, CancellationToken cancellationToken);
    }
}