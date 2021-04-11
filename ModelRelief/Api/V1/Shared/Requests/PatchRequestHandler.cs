﻿// -----------------------------------------------------------------------
// <copyright file="PatchRequestHandler.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Threading;
    using System.Threading.Tasks;
    using AutoMapper;
    using FluentValidation;
    using FluentValidation.Results;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Errors;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
    using ModelRelief.Features.Settings;
    using ModelRelief.Services.Relationships;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents a handler for a PATCH request for a model.
    /// </summary>
    /// <typeparam name="TEntity">Domain model</typeparam>
    /// <typeparam name="TGetModel">DTO PATCH model.</typeparam>
    public class PatchRequestHandler<TEntity, TGetModel> : ValidatedHandler<PatchRequest<TEntity, TGetModel>, TGetModel>
        where TEntity    : DomainModel
        where TGetModel  : IModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="PatchRequestHandler{TEntity, TGetModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IWebHostEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="dependencyManager">Services for dependency processing.</param>
        /// <param name="validators">All validators matching IValidator for the given request.</param>
        /// <param name="settingsManager">ISettingsManager</param>
        /// <param name="query">IQuery</param>
        /// <param name="modelReferenceValidator">IModelReferenceValidator</param>
        public PatchRequestHandler(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IWebHostEnvironment hostingEnvironment,
            Services.IConfigurationProvider  configurationProvider,
            IDependencyManager dependencyManager,
            IEnumerable<IValidator<PatchRequest<TEntity, TGetModel>>> validators,
            ISettingsManager settingsManager,
            IQuery query,
            IModelReferenceValidator modelReferenceValidator)
            : base(dbContext, loggerFactory, mapper, hostingEnvironment, configurationProvider, dependencyManager, validators, settingsManager, query, modelReferenceValidator)
        {
        }

        /// <summary>
        /// Builds the UpdatedModel property containing the complete composition of old and new properties.
        /// </summary>
        /// <param name="request">PATCH request.</param>
        /// <returns>TGetModel</returns>
        public async Task<TGetModel> BuildUpdatedTGetModel(PatchRequest<TEntity, TGetModel> request)
        {
            var domainModel = await Query.FindDomainModelAsync<TEntity>(request.User, request.Id);

            var updatedDomainModel = BuildUpdatedDomainModel(request, domainModel);
            request.UpdatedModel = Mapper.Map<TEntity, TGetModel>(updatedDomainModel);

            return request.UpdatedModel;
        }

        /// <summary>
        /// Converts a PATCH request to a domain model (for validation).
        /// </summary>
        /// <param name="request">PATCH request.</param>
        /// <param name="model">Domain model.</param>
        /// <returns>Domain model</returns>
        public TEntity BuildUpdatedDomainModel(PatchRequest<TEntity, TGetModel> request, TEntity model)
        {
            var properties = typeof(TEntity).GetProperties();
            foreach (var patchProperty in request.Parameters)
            {
                var name  = patchProperty.Key;
                var value = patchProperty.Value;

                // find matching property in target object
                PropertyInfo property = null;
                try
                {
                    // invalid property: exception
                    property = properties.Single(p => p.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
                }
                catch (Exception)
                {
                    var validationFailure = new ValidationFailure(name, $"The property {name} is not a valid property for this resource.");
                    throw new RequestValidationException(typeof(PatchRequest<TEntity, TGetModel>), new List<ValidationFailure> { validationFailure });
                }

                // now set property in target
                object domainValue = null;
                try
                {
                    domainValue = property.PropertyType.IsEnum ?
                        Enum.ToObject(property.PropertyType, value) :
                        // https://stackoverflow.com/questions/19811583/invalid-cast-from-system-double-to-system-nullable
                        System.Convert.ChangeType(value, Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType);
                 }
                catch (Exception ex)
                {
                    var conversionException = ex;
                    var validationFailure = new ValidationFailure(name, $"The property value {value} cannot be converted to a valid property value.");
                    throw new RequestValidationException(typeof(PatchRequest<TEntity, TGetModel>), new List<ValidationFailure> { validationFailure });
                }

                property.SetValue(model, value: domainValue);
            }

            return model;
        }

        /// <summary>
        /// Pre-handler; performns any initialization or setup required before the request is handled.
        /// </summary>
        /// <param name="request">Request object</param>
        /// <param name="cancellationToken">Token to allow asyn request to be cancelled.</param>
        public override async Task PreHandle(PatchRequest<TEntity, TGetModel> request, CancellationToken cancellationToken)
        {
            // construct to support validation
            await BuildUpdatedTGetModel(request);
        }

        /// <summary>
        /// Handles a PATCH model request.
        /// </summary>
        /// <param name="request">PATCH request.</param>
        /// <param name="cancellationToken">Token to allow the async operation to be cancelled.</param>
        /// <returns>Patched TGetModel</returns>
        public override async Task<TGetModel> OnHandle(PatchRequest<TEntity, TGetModel> request, CancellationToken cancellationToken)
        {
            // find target model
            var targetModel = await Query.FindDomainModelAsync<TEntity>(request.User, request.Id);

            // update from request
            var updatedModel = BuildUpdatedDomainModel(request, targetModel);

            // validate all references are owned
            await ReferenceValidator.ValidateAsync<TEntity>(updatedModel, request.User);

            await DependencyManager.PersistChangesAsync(updatedModel, cancellationToken);

            var projectedModel = await Query.FindDtoModelAsync<TEntity, TGetModel>(request.User, request.Id);
            return projectedModel;
        }
    }
}