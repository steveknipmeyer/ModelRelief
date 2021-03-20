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
    using ModelRelief.Api.V1.Shared.Rest;
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

        /// <summary>
        /// Validates a single (foreign key) reference property of a model.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="model">Model being validating</param>
        /// <param name="properties">Model properties</param>
        /// <param name="foreignKeyPropertyName">(Foreign key) reference property name </param>
        /// <param name="foreignKey">Foreign key</param>
        /// <param name="validationFailures">Collection of active validation errors.</param>
        private async Task ValidateReference<TEntity>(ClaimsPrincipal user, TEntity model, PropertyInfo[] properties, string foreignKeyPropertyName, int? foreignKey, List<ValidationFailure> validationFailures)
            where TEntity : DomainModel
        {
            var type = typeof(TEntity);

            // find actual reference property (e.g. MeshId -> Mesh)
            var referencePropertyName = foreignKeyPropertyName.Substring(0, foreignKeyPropertyName.LastIndexOf("Id"));
            var referenceType = type.GetProperty(referencePropertyName)?.PropertyType;
            if (referenceType == null)
                return;

            // https://stackoverflow.com/questions/4101784/calling-a-generic-method-with-a-dynamic-type
            // https://stackoverflow.com/questions/16153047/net-invoke-async-method-and-await
            var findMethod = typeof(Query).GetMethod(nameof(Query.FindDomainModelAsync), new Type[] { typeof(ClaimsPrincipal), typeof(int?), typeof(GetQueryParameters), typeof(bool) }).MakeGenericMethod(referenceType);
            dynamic task = findMethod.Invoke(Query, new object[] { user, foreignKey, new GetQueryParameters(), false });
            await task;
            dynamic referenceModel = Convert.ChangeType(task.Result, referenceType);
            if (referenceModel == null)
            {
                validationFailures.Add(new ValidationFailure(foreignKeyPropertyName, $"Property '{foreignKeyPropertyName}' references an entity that does not exist."));
                return;
            }

            Dictionary<string, object> referenceModelProperties = ((object)referenceModel)
                                                    .GetType()
                                                    .GetProperties()
                                                    .ToDictionary(p => p.Name, p => p.GetValue(referenceModel));

            // verify reference model belongs to same project as parent model

            // IProjectModel?
            // How can the model Project be determined?
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

            Type type = typeof(TEntity);
            PropertyInfo[] properties = type.GetProperties();
            foreach (PropertyInfo property in properties)
            {
                var propertyName = property.Name;
                var propertyValue = property.GetValue(model);

                // skip read-only properties (e.g. calculated FileDomainModel properties)
                if (!property.CanWrite)
                    continue;

                // skip properties that are not foreign keys
                if (!propertyName.EndsWith("Id"))
                    continue;

                switch (propertyName)
                {
                    // skip primary key
                    case "Id":
                    case "UserId":
                        continue;

                    case "ProjectId":
                        if (propertyValue == null)
                        {
                            propertyValue = SettingsManager.UserSession.ProjectId;
                            property.SetValue(model, propertyValue);
                        }
                        break;

                    default:
                        break;
                }
                var foreignKeyPropertyName = propertyName;
                int? foreignKey = (int?)propertyValue;
                if (foreignKey == null)
                    continue;

                // Console.WriteLine("Verifying reference property: " + propertyName + ", Value: " + propertyValue);
                await ValidateReference<TEntity>(user, model, properties, foreignKeyPropertyName, foreignKey, validationFailures);
            }

            if (validationFailures.Count() > 0)
            {
                // package TRequest type with FV ValidationException
                throw new ApiValidationException(typeof(ModelReferenceValidator), validationFailures);
            }
        }
    }
}