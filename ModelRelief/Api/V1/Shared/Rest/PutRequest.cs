// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using FluentValidation.Results;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Api.V1.Shared.Errors;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    ///  Represents a PUT request to update the properties of a model.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <typeparam name="TGetModel">The DTO GET model.</typeparam>
    /// <remarks>This request is used to update a subset of the properties of an existing model.</remarks>
    public class PutRequest<TEntity, TGetModel> : IRequest<TGetModel>
        where TEntity   : DomainModel
        where TGetModel : IIdModel
    {
        /// <summary>
        /// Gets or sets the User posting the Put request.
        /// </summary>
        public ClaimsPrincipal User { get; set;}

        /// <summary>
        /// Gets or sets the Id of the model to update.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the Dictionary of key:values to use to update the model properties.
        /// </summary>
        public Dictionary<string, object> Parameters { get; set; }
        
        /// <summary>
        /// Gets or sets the Database context.
        /// </summary>
        public ModelReliefDbContext DbContext  { get; set; }

        /// <summary>
        /// Gets or sets the updated model after applying the collection of incoming properties to the domain model.
        /// </summary>
        public TGetModel UpdatedModel { get; set; }
        
        /// <summary>
        /// Builds the UpdatedModel property containing the complete composition of old and new properties.
        /// </summary>
        /// <returns>TGetModel</returns>
        public async Task<TGetModel> BuildUpdatedModel (UserManager<ApplicationUser> userManager, IMapper mapper)
        {
            var domainModel = await BuildDomainModel(userManager);
            UpdatedModel = mapper.Map<TEntity, TGetModel>(domainModel);

            return UpdatedModel;
        }

        /// <summary>
        /// Converts a PUT request to a domain model (for validation).
        /// </summary>
        /// <returns>Domain model</returns>
        public async Task<TEntity> BuildDomainModel (UserManager<ApplicationUser> userManager)
        {
            // find target model
            var user = await Identity.GetApplicationUserAsync(userManager, User);
            var model = await DbContext.Set<TEntity>()
                .Where(m => ((m.Id == this.Id) &&
                             (m.User.Id == user.Id)))
                .SingleOrDefaultAsync();

            if (model == null)
                throw new EntityNotFoundException(typeof(TEntity), this.Id);

            var properties = typeof(TEntity).GetProperties();
            foreach (var putProperty in this.Parameters) 
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
                    throw new ApiValidationException(typeof(PutRequest<TEntity, TGetModel>), new List<ValidationFailure> {validationFailure});
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
                    throw new ApiValidationException(typeof(PutRequest<TEntity, TGetModel>), new List<ValidationFailure> {validationFailure});
                }

                property.SetValue(model, value: domainValue);
            }

            return model;
        }
    }
}
