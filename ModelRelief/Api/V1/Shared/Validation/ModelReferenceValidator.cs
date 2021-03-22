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
        /// Determines if a model property should be validated.
        /// </summary>
        /// <param name="property">Model property</param>
        /// <returns>true if property must be validated.</returns>
        private bool ModelPropertyIsValidatable(PropertyInfo property)
        {
            // skip read-only properties (e.g. calculated FileDomainModel properties)
            if (!property.CanWrite)
                return false;

            // skip properties that are not foreign keys
            if (!property.Name.EndsWith("Id"))
                return false;

            switch (property.Name)
            {
                // skip
                case "Id":
                case "UserId":
                    return false;

                default:
                    break;
            }
            return true;
        }

        /// <summary>
        ///  Validates the Project of a model.
        /// </summary>
        /// <param name="model">Model to validate.</param>
        /// <param name="properties">Model properties</param>
        /// <typeparam name="TEntity">Type of model</typeparam>
        /// <returns></returns>
        private int? ValidateProject<TEntity>(TEntity model, PropertyInfo[] properties)
            where TEntity : DomainModel
        {
            var projectIdProperty = properties.Where(p => p.Name == "ProjectId").SingleOrDefault();
            if (projectIdProperty == null)
                return null;

            int? projectId = projectIdProperty.GetValue(model) as int?;
            if (projectId == null)
            {
                projectId = SettingsManager.UserSession.ProjectId;
                projectIdProperty.SetValue(model, projectId);
            }

            return projectId;
        }

        /// <summary>
        /// Validates a single (foreign key) reference property of a model.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="model">Model to validate.</param>
        /// <param name="properties">Model properties</param>
        /// <param name="modelProjectId">Model project</param>
        /// <param name="foreignKeyPropertyName">(Foreign key) reference property name </param>
        /// <param name="foreignKey">Foreign key</param>
        private async Task<List<ValidationFailure>> ValidateReferenceAsync<TEntity>(ClaimsPrincipal user, TEntity model, PropertyInfo[] properties, int? modelProjectId, string foreignKeyPropertyName, int? foreignKey)
            where TEntity : DomainModel
        {
            // if ((foreignKey ?? 0) == 0)
            //     Console.WriteLine($"{typeof(TEntity).Name} {model.Name} foreign key: [{foreignKeyPropertyName}, {foreignKey}]");

            var propertyValidationFailures = new List<ValidationFailure>();
            var type = typeof(TEntity);

            // find actual reference property (e.g. MeshId -> Mesh)
            var referencePropertyName = foreignKeyPropertyName.Substring(0, foreignKeyPropertyName.LastIndexOf("Id"));
            var referenceType = type.GetProperty(referencePropertyName)?.PropertyType;
            if (referenceType == null)
                return propertyValidationFailures;

            // https://stackoverflow.com/questions/4101784/calling-a-generic-method-with-a-dynamic-type
            // https://stackoverflow.com/questions/16153047/net-invoke-async-method-and-await
            var findMethod = typeof(Query).GetMethod(nameof(Query.FindDomainModelAsync), new Type[] { typeof(ClaimsPrincipal), typeof(int?), typeof(GetQueryParameters), typeof(bool) }).MakeGenericMethod(referenceType);
            dynamic task = findMethod.Invoke(Query, new object[] { user, foreignKey, new GetQueryParameters(), false });
            await task;
            dynamic referenceModel = Convert.ChangeType(task.Result, referenceType);
            if (referenceModel == null)
            {
                propertyValidationFailures.Add(new ValidationFailure(foreignKeyPropertyName, $"Property '{foreignKeyPropertyName}' references an entity that does not exist."));
                return propertyValidationFailures;
            }
            Dictionary<string, object> referenceModelProperties = ((object)referenceModel)
                                                    .GetType()
                                                    .GetProperties()
                                                    .ToDictionary(p => p.Name, p => p.CanWrite ? p.GetValue(referenceModel) : string.Empty);

            // verify reference model belongs to same project as parent model
            if (modelProjectId == null)
                return propertyValidationFailures;

            if (!referenceModelProperties.ContainsKey("ProjectId"))
                return propertyValidationFailures;

            var projectId = referenceModelProperties["ProjectId"] as int?;
            if (projectId == null)
                return propertyValidationFailures;

            if (modelProjectId != projectId)
            {
                var message = $"{referenceModel} ProjectId {projectId} belongs to a different project than its parent model {modelProjectId}.";
                // propertyValidationFailures.Add(new ValidationFailure("ProjectId", message));
            }
            return propertyValidationFailures;
        }

        /// <summary>
        /// Validated the property references of the given model to ensure they exist and are owned by the active user.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="model">Model to validate.</param>
        /// <param name="user">Active user for this request.</param>
        /// <param name="throwIfError">Throw exception instead of returning the collection of validation errors.</param>
        public async Task<List<ValidationFailure>> ValidateAsync<TEntity>(TEntity model, ClaimsPrincipal user, bool throwIfError = true)
            where TEntity : DomainModel
        {
            await SettingsManager.InitializeUserSessionAsync(user);
            var modelValidationFailures = new List<ValidationFailure>();
            var propertyValidationFailures = new List<ValidationFailure>();

            Type type = typeof(TEntity);
            PropertyInfo[] properties = type.GetProperties();

            var modelProjectId = ValidateProject<TEntity>(model, properties);

            foreach (PropertyInfo property in properties)
            {
                if (!ModelPropertyIsValidatable(property))
                    continue;

                var foreignKeyPropertyName = property.Name;
                int? foreignKey = property.GetValue(model) as int?;
                if (foreignKey == null)
                    continue;

                propertyValidationFailures = await ValidateReferenceAsync<TEntity>(user, model, properties, modelProjectId, foreignKeyPropertyName, foreignKey);
                modelValidationFailures.AddRange(propertyValidationFailures);
            }

            if (throwIfError && (modelValidationFailures.Count() > 0))
            {
                // package TRequest type with FV ValidationException
                throw new ApiValidationException(typeof(ModelReferenceValidator), modelValidationFailures);
            }
            return modelValidationFailures;
        }
    }
}