// -----------------------------------------------------------------------
// <copyright file="ValidatedHandler.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Validation
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
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Errors;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Features.Settings;
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
        public ISettingsManager                 SettingsManager { get; set; }
        public IEnumerable<IValidator<TRequest>> Validators { get; }
        public Query Query { get; set; }
        public ModelReferenceValidator ReferenceValidator { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ValidatedHandler{TRequest, TResponse}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="loggerFactory">ILoggerFactory.</param>
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

            SettingsManager = new SettingsManager(HostingEnvironment, ConfigurationProvider, Mapper, loggerFactory, DbContext);
            Query = new Query(DbContext, loggerFactory, Mapper);
            ReferenceValidator = new ModelReferenceValidator(DbContext, loggerFactory, Mapper, HostingEnvironment, ConfigurationProvider);
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

                var propertyName = property.Name;
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
                var referenceType = type.GetProperty(referencePropertyName)?.PropertyType;

                if (referenceType == null)
                    continue;

                // Console.WriteLine("Verifying reference property: " + propertyName + ", Value: " + propertyValue, null);
                switch (referenceType.Name)
                {
                    case nameof(ApplicationUser):
                        // ModelExistsAsync requires the primary key to be an integer.
                        continue;

                    // case nameof(Project):
                    //     if (((propertyValue as int?) ?? 0) == 0)
                    //         property.SetValue(model, SettingsManager.UserSession.ProjectId);
                    //     continue;

                    default:
                        break;
                }

                await ValidateReference(claimsPrincipal, validationFailures, propertyName, propertyValue, referenceType);
            }

            if (validationFailures.Count() > 0)
            {
                // package TRequest type with FV ValidationException
                throw new ApiValidationException(typeof(TRequest), validationFailures);
            }
        }

        private async Task ValidateReference(ClaimsPrincipal claimsPrincipal, List<ValidationFailure> validationFailures, string propertyName, object propertyValue, Type referenceType)
        {
            // https://stackoverflow.com/questions/4101784/calling-a-generic-method-with-a-dynamic-type
            // https://stackoverflow.com/questions/16153047/net-invoke-async-method-and-await
            var method = typeof(Query).GetMethod(nameof(Query.ModelExistsAsync)).MakeGenericMethod(referenceType);
            var modelExists = await (Task<bool>)method.Invoke(Query, new object[] { claimsPrincipal, (int)propertyValue });
            if (!modelExists)
                validationFailures.Add(new ValidationFailure(propertyName, $"Property '{propertyName}' references an entity that does not exist."));
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