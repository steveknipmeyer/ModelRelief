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

namespace ModelRelief.Api.V1.Shared.Rest
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
        /// <param name="validators">All validators matching IValidator for the given request.</param>
        public PutRequestHandler(ModelReliefDbContext dbContext, IMapper mapper, IEnumerable<IValidator<PutRequest<TEntity, TGetModel>>> validators)
            : base(dbContext, mapper, validators) {}

        /// <summary>
        /// Pre-handler; performns any initialization or setup required before the request is handled.
        /// </summary>
        /// <param name="message">Request object</param>
        /// <param name="cancellationToken">Token to allow asyn request to be cancelled.</param>
        /// <returns></returns>
        public override async Task PreHandle(PutRequest<TEntity, TGetModel> message, CancellationToken cancellationToken) 
        { 
            await message.BuildUpdatedModel(); 
        }

        /// <summary>
        /// Handles a PUT model request.
        /// </summary>
        /// <param name="message">PUT request.</param>
        /// <param name="cancellationToken">Token to allow the async operation to be cancelled.</param>
        /// <returns></returns>
        public override async Task<TGetModel> OnHandle(PutRequest<TEntity, TGetModel> message, CancellationToken cancellationToken)
        {
            // N.B. All validators have been run. If there was an error, an ApiValidationExveption was thrown.

            // find target model
            var model = await message.BuildDomainModel();

            await DbContext.SaveChangesAsync();

            var expandedModel = await DbContext.Set<TEntity>()
                 .ProjectTo<TGetModel>(Mapper.ConfigurationProvider)
                 .SingleOrDefaultAsync(m => m.Id == message.Id);

            return expandedModel;
        }
    }
}