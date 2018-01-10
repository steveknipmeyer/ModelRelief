﻿// -----------------------------------------------------------------------
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
    using FluentValidation;
    using FluentValidation.Results;
    using MediatR;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Errors;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Services.Relationships;
    using ModelRelief.Utility;

    /// <summary>
    /// Abstract representation of request handler that supports validation.
    /// </summary>
    /// <typeparam name="TRequest">Request object.</typeparam>
    /// <typeparam name="TResponse">Response object.</typeparam>
    public abstract class ValidatedHandler<TRequest, TResponse> : ICancellableAsyncRequestHandler<TRequest, TResponse>
        where TRequest : IRequest<TResponse>
    {
        public ModelReliefDbContext             DbContext { get; }
        public UserManager<ApplicationUser>     UserManager { get; }
        public ILogger                          Logger { get; }
        public IMapper                          Mapper { get; }
        public IHostingEnvironment              HostingEnvironment { get; }
        public Services.IConfigurationProvider  ConfigurationProvider { get; }
        public IDependencyManager               DependencyManager { get; }
        public IEnumerable<IValidator<TRequest>> Validators { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ValidatedHandler{TRequest, TResponse}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="userManager">UserManager (ClaimsPrincipal -> ApplicationUser).</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="dependencyManager">Services for dependency processing.</param>
        /// <param name="validators">List of validators</param>
        public ValidatedHandler(
            ModelReliefDbContext dbContext,
            UserManager<ApplicationUser> userManager,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IHostingEnvironment hostingEnvironment,
            Services.IConfigurationProvider configurationProvider,
            IDependencyManager dependencyManager,
            IEnumerable<IValidator<TRequest>> validators)
        {
            DbContext =             dbContext ?? throw new System.ArgumentNullException(nameof(dbContext));
            UserManager =           userManager ?? throw new System.ArgumentNullException(nameof(dbContext));
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
        /// Returns the domain model for a given Id.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="claimsPrincipal">Current HttpContext User.</param>
        /// <param name="id">Target id to retrieve.</param>
        /// <param name="throwIfNotFound">Throw EntityNotFoundException if not found.</param>
        /// <returns>Domain model if exists, null otherwise.</returns>
        public virtual async Task<TEntity> FindModelAsync<TEntity>(ClaimsPrincipal claimsPrincipal, int id, bool throwIfNotFound = true)
            where TEntity : DomainModel
        {
            var user = await Identity.FindApplicationUserAsync(UserManager, claimsPrincipal);
            return await FindModelAsync<TEntity>(user, id, throwIfNotFound);
        }

        /// <summary>
        /// Returns the domain model for a given Id.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="applicationUser">ApplicationUser.</param>
        /// <param name="id">Target id to retrieve.</param>
        /// <param name="throwIfNotFound">Throw EntityNotFoundException if not found.</param>
        /// <returns>Domain model if exists, null otherwise.</returns>
        public virtual async Task<TEntity> FindModelAsync<TEntity>(ApplicationUser applicationUser, int id, bool throwIfNotFound = true)
            where TEntity : DomainModel
        {
            return await FindModelAsync<TEntity>(applicationUser.Id, id, throwIfNotFound);
        }

        /// <summary>
        /// Returns the domain model for a given Id.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="userId">ApplicationUser Id.</param>
        /// <param name="id">Target id to retrieve.</param>
        /// <param name="throwIfNotFound">Throw EntityNotFoundException if not found.</param>
        /// <returns>Domain model if exists, null otherwise.</returns>
        public virtual async Task<TEntity> FindModelAsync<TEntity>(string userId, int id, bool throwIfNotFound = true)
            where TEntity : DomainModel
        {
            var domainModel = await DbContext.Set<TEntity>()
                                .Where(m => (m.Id == id) &&
                                            (m.UserId == userId))
                                .SingleOrDefaultAsync();

            if (throwIfNotFound && (domainModel == null))
                throw new EntityNotFoundException(typeof(TEntity), id);

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

                Console.WriteLine("Verifying reference property: " + propertyName + ", Value: " + propertyValue, null);
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
        /// <returns></returns>
        public virtual async Task PreHandle(TRequest message, CancellationToken cancellationToken)
        {
            await Task.CompletedTask;
        }

        /// <summary>
        /// Validation pre-processor for request.
        /// </summary>
        /// <param name="message">Request object</param>
        /// <param name="cancellationToken">Token to allow asyn request to be cancelled.</param>
        /// <returns></returns>
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
        /// <returns></returns>
        public abstract Task<TResponse> OnHandle(TRequest message, CancellationToken cancellationToken);
    }
}