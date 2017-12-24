// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Api.V1.Extensions;
using ModelRelief.Infrastructure;
using ModelRelief.Api.V1.Shared.Errors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using ModelRelief.Utility;
using System.Reflection;
using FluentValidation.Results;

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    /// Represents a handler for a PUT request for a model.
    /// </summary>
    /// <typeparam name="TEntity">Domain model</typeparam>
    /// <typeparam name="TGetModel">DTO PUT model.</typeparam>
    public class PatchRequestHandler<TEntity, TGetModel> : ValidatedHandler<PatchRequest<TEntity, TGetModel>, TGetModel>
        where TEntity    : DomainModel
        where TGetModel  : ITGetModel
    {
        private ILogger<TEntity> Logger { get; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="userManager">UserManager (ClaimsPrincipal -> ApplicationUser).</param>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="validators">All validators matching IValidator for the given request.</param>
        /// <param name="logger">ILogger.</param>
       public PatchRequestHandler(UserManager<ApplicationUser> userManager, ModelReliefDbContext dbContext, IMapper mapper, IHostingEnvironment hostingEnvironment, Services.IConfigurationProvider  configurationProvider, IEnumerable<IValidator<PatchRequest<TEntity, TGetModel>>> validators, ILogger<TEntity> logger)
            : base(userManager, dbContext, mapper, hostingEnvironment, configurationProvider, validators)
        {
            Logger = logger;
        }

        /// <summary>
        /// Builds the UpdatedModel property containing the complete composition of old and new properties.
        /// </summary>
        /// <returns>TGetModel</returns>
        public async Task<TGetModel> BuildUpdatedTGetModel (PatchRequest<TEntity, TGetModel> message)
        {
            var domainModel = await FindModelAsync<TEntity>(message.User, message.Id);

            var updatedDomainModel = BuildUpdatedDomainModel(message, domainModel);
            message.UpdatedModel = Mapper.Map<TEntity, TGetModel>(updatedDomainModel);

            return message.UpdatedModel;
        }

        /// <summary>
        /// Converts a PUT request to a domain model (for validation).
        /// </summary>
        /// <returns>Domain model</returns>
        public TEntity BuildUpdatedDomainModel (PatchRequest<TEntity, TGetModel> message, TEntity model)
        {
            var properties = typeof(TEntity).GetProperties();
            foreach (var putProperty in message.Parameters) 
            {
                var name  = putProperty.Key;
                var value = putProperty.Value;

                // find matching property in target object
                PropertyInfo property = null;
                try
                {
                    property = properties.Single(p => p.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
                    if (property == null)
                        continue;
                }
                catch (Exception )
                {
                    var validationFailure = new ValidationFailure(name, $"The property {name} is not a valid property for this resource.");
                    throw new ApiValidationException(typeof(PatchRequest<TEntity, TGetModel>), new List<ValidationFailure> {validationFailure});
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
                catch (Exception )
                {
                    var validationFailure = new ValidationFailure(name, $"The property value {value} cannot be converted to a valid property value.");
                    throw new ApiValidationException(typeof(PatchRequest<TEntity, TGetModel>), new List<ValidationFailure> {validationFailure});
                }

                property.SetValue(model, value: domainValue);
            }

            return model;
        }

        /// <summary>
        /// Pre-handler; performns any initialization or setup required before the request is handled.
        /// </summary>
        /// <param name="message">Request object</param>
        /// <param name="cancellationToken">Token to allow asyn request to be cancelled.</param>
        /// <returns></returns>
        public override async Task PreHandle(PatchRequest<TEntity, TGetModel> message, CancellationToken cancellationToken) 
        { 
            // construct to support validation
            await BuildUpdatedTGetModel(message); 
        }

        /// <summary>
        /// Handles a PUT model request.
        /// </summary>
        /// <param name="message">PUT request.</param>
        /// <param name="cancellationToken">Token to allow the async operation to be cancelled.</param>
        /// <returns></returns>
        public override async Task<TGetModel> OnHandle(PatchRequest<TEntity, TGetModel> message, CancellationToken cancellationToken)
        {           
            var model = await FindModelAsync<TEntity>(message.User, message.Id);

            // find target model
            model = BuildUpdatedDomainModel(message, model);

            // validate all references are owned
            await ValidateReferences<TEntity>(model, message.User);

            await DbContext.SaveChangesAsync();

            var expandedModel = await DbContext.Set<TEntity>()
                 .ProjectTo<TGetModel>(Mapper.ConfigurationProvider)
                 .SingleOrDefaultAsync(m => m.Id == message.Id);

            return expandedModel;
        }
    }
}