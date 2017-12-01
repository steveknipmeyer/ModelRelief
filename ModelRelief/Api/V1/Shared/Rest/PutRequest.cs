// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using System.Collections.Generic;
using MediatR;
using ModelRelief.Domain;
using ModelRelief.Api.V1.Shared.Errors;
using System.Linq;
using System;
using ModelRelief.Database;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using System.Threading.Tasks;

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    ///  Represents a PUT request to update the properties of a model.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <typeparam name="TGetModel">The DTO GET model.</typeparam>
    public class PutRequest<TEntity, TGetModel> : IRequest<TGetModel>
        where TEntity   : ModelReliefModel
        where TGetModel : IGetModel
    {
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
        public async Task<TGetModel> BuildUpdatedModel ()
        {
            var domainModel = await BuildDomainModel();
            UpdatedModel = Mapper.Map<TEntity, TGetModel>(domainModel);

            return UpdatedModel;
        }

        /// <summary>
        /// Converts a PUT request to a domain model (for validation).
        /// </summary>
        /// <returns>Domain model</returns>
        public async Task<TEntity> BuildDomainModel ()
        {
            // find target model
            var model = await DbContext.Set<TEntity>()
                .SingleOrDefaultAsync(m => m.Id == this.Id);

            if (model == null)
                throw new EntityNotFoundException(typeof(TEntity), this.Id);

            var properties = typeof(TEntity).GetProperties();
            foreach (var putProperty in this.Parameters) 
            {
                var name  = putProperty.Key;
                var value = putProperty.Value;

                // find matching property in target object
                var property = properties.Single(p => p.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
                if (property == null)
                    continue;

                // now set property in target
                var domainValue = property.PropertyType.IsEnum ? 
                    Enum.ToObject(property.PropertyType, value) : 
                    // https://stackoverflow.com/questions/19811583/invalid-cast-from-system-double-to-system-nullable
                    Convert.ChangeType(value, Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType);

                property.SetValue(model, value: domainValue);
            }

            return model;
        }
    }
}
