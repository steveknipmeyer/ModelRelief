// -----------------------------------------------------------------------
// <copyright file="ModelReferenceValidator.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Validation
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Reflection;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using AutoMapper;
    using FluentValidation.Results;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Errors;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Features.Settings;
    using ModelRelief.Utility;

    /// <summary>
    /// Validator for model reference properties.
    /// </summary>
    public class ModelReferenceValidator : IModelReferenceValidator
    {
        public ModelReliefDbContext             DbContext { get; }
        public ILogger                          Logger { get; }
        public IMapper                          Mapper { get; }
        public IWebHostEnvironment              HostingEnvironment { get; }
        public Services.IConfigurationProvider  ConfigurationProvider { get; }
        public ISettingsManager                 SettingsManager { get; set; }
        public Query Query { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ModelReferenceValidator"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="loggerFactory">ILoggerFactory.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IWebHostEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        public ModelReferenceValidator(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IWebHostEnvironment hostingEnvironment,
            Services.IConfigurationProvider configurationProvider)
        {
            DbContext =             dbContext ?? throw new System.ArgumentNullException(nameof(dbContext));
            Logger =                (loggerFactory == null) ? throw new System.ArgumentNullException(nameof(loggerFactory)) : loggerFactory.CreateLogger(typeof(ModelReferenceValidator).Name);
            Mapper =                mapper ?? throw new System.ArgumentNullException(nameof(mapper));
            HostingEnvironment =    hostingEnvironment ?? throw new System.ArgumentNullException(nameof(hostingEnvironment));
            ConfigurationProvider = configurationProvider ?? throw new System.ArgumentNullException(nameof(configurationProvider));

            SettingsManager = new SettingsManager(HostingEnvironment, ConfigurationProvider, Mapper, loggerFactory, DbContext);
            Query = new Query(DbContext, loggerFactory, Mapper);
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
        /// Validated the property references of the given model to ensure they exist and are owned by the active user.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="model">Model to validate.</param>
        /// <param name="user">Active user for this request.</param>
        public async Task Validate<TEntity>(TEntity model, ClaimsPrincipal user)
            where TEntity : DomainModel
        {
            await SettingsManager.InitializeUserSessionAsync(user);
            var validationFailures = new List<ValidationFailure>();

            Type type = model.GetType();
            PropertyInfo[] properties = type.GetProperties();
            foreach (PropertyInfo property in properties)
            {
                // skip read-only properties (e.g. calculated FileDomainModel properties)
                if (!property.CanWrite)
                    continue;

                var propertyName = property.Name;
                var propertyValue = property.GetValue(model);

                switch (propertyName)
                {
                    // skip primary key
                    case "Id":
                        continue;

                    case "ProjectId":
                        if (((propertyValue as int?) ?? 0) == 0)
                            property.SetValue(model, SettingsManager.UserSession.ProjectId);
                        break;

                    default:
                        break;
                }

                // skip properties that are not foreign keys
                if (!propertyName.EndsWith("Id"))
                    continue;

                // skip null foreign keys
                if (propertyValue == null)
                    continue;

                // find actual reference property
                var referencePropertyName = propertyName.Substring(0, propertyName.LastIndexOf("Id"));
                var referenceType = type.GetProperty(referencePropertyName)?.PropertyType;
                if (referenceType == null)
                {
                    // e.g. UserId
                    continue;
                }

                // Console.WriteLine("Verifying reference property: " + propertyName + ", Value: " + propertyValue);
                await ValidateReference(user, validationFailures, propertyName, propertyValue, referenceType);
            }

            if (validationFailures.Count() > 0)
            {
                // package TRequest type with FV ValidationException
                throw new ApiValidationException(typeof(ModelReferenceValidator), validationFailures);
            }
        }
    }
}