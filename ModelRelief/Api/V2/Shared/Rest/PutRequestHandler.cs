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
using ModelRelief.Api.V2.Extensions;
using ModelRelief.Infrastructure;
using ModelRelief.Api.V2.Shared.Errors;

namespace ModelRelief.Api.V2.Shared.Rest
{
    /// <summary>
    /// Represents a handler for a PUT request for a model.
    /// </summary>
    /// <typeparam name="TEntity">Domain model</typeparam>
    /// <typeparam name="TGetModel">DTO PUT model.</typeparam>
    public class PutRequestHandler<TEntity, TGetModel> : ValidatedHandler<PutRequest<TEntity, TGetModel>, TGetModel>
        where TEntity    : ModelReliefModel
        where TGetModel  : IGetModel
    {
        /// <summary>
        /// Contstructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        public PutRequestHandler(ModelReliefDbContext dbContext, IMapper mapper, IEnumerable<IValidator<PutRequest<TEntity, TGetModel>>> validators)
            : base(dbContext, mapper, validators)
        {
            // WIP: How should validation be done for a PUT request?
            //      Can the validation be applied after the target model has been updated (but before it is written to the database)?
            //      The validators could be applied and then an exception could be thrown if there are errors.
            //      The validation exception would be caught by ApiController and then a structured ErrorResponse result returned.
        }

        /// <summary>
        /// Handles a PUT model request.
        /// </summary>
        /// <param name="message">PUT request.</param>
        /// <param name="cancellationToken">Token to allow the async operation to be cancelled.</param>
        /// <returns></returns>
        public override async Task<TGetModel> OnHandle(PutRequest<TEntity, TGetModel> message, CancellationToken cancellationToken)
        {
            // find target model
            var model = await DbContext.Set<TEntity>()
                .SingleOrDefaultAsync(m => m.Id == message.Id);

            if (model == null) {
                throw new EntityNotFoundException(typeof(TEntity), message.Id);
            }

            var properties = typeof(TEntity).GetProperties();

            foreach (var putProperty in message.Parameters) {
                var name  = putProperty.Key;
                var value = putProperty.Value;

                // find matching property in target object
                var property = properties.Single(p => p.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
                if (property == null) {
                    continue;
                }

                // now set property in target
                property.SetValue(model, Convert.ChangeType(value, property.PropertyType));
            }

            await DbContext.SaveChangesAsync();
            return Mapper.Map<TGetModel>(model);
        }
    }
}