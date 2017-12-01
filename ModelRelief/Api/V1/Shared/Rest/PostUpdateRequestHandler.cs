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

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    /// Represents a handler for a POST request to update an existing model.
    /// </summary>
    /// <remarks>All properties are updated.</remarks>
    /// <typeparam name="TEntity">Domain model</typeparam>
    /// <typeparam name="TPostModel">DTO POST model.</typeparam>
    /// <typeparam name="TGetModel">DTO GET model.</typeparam>
    public class PostUpdateRequestHandler<TEntity, TPostModel, TGetModel> : ValidatedHandler<PostUpdateRequest<TEntity, TPostModel, TGetModel>, TGetModel>
        where TEntity    : ModelReliefModel
        where TPostModel : class
        where TGetModel  : IGetModel
    {
        /// <summary>
        /// Contstructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="validators">All validators matching IValidator for the given request.</param>
        public PostUpdateRequestHandler(ModelReliefDbContext dbContext, IMapper mapper, IEnumerable<IValidator<PostUpdateRequest<TEntity, TPostModel, TGetModel>>> validators)
            : base(dbContext, mapper, validators)
        {
        }

        /// <summary>
        /// Handles a POST model request.
        /// </summary>
        /// <param name="message">POST request.</param>
        /// <param name="cancellationToken">Token to allow the async operation to be cancelled.</param>
        /// <returns></returns>
        public override async Task<TGetModel> OnHandle(PostUpdateRequest<TEntity, TPostModel, TGetModel> message, CancellationToken cancellationToken)
        {
            var updatedModel = Mapper.Map<TEntity>(message.UpdatedModel);
            DbContext.Set<TEntity>().Update(updatedModel);
            await DbContext.SaveChangesAsync(cancellationToken);

            var expandedUpdatedModel = await DbContext.Set<TEntity>()
                 .ProjectTo<TGetModel>(Mapper.ConfigurationProvider)
                 .SingleOrDefaultAsync(m => m.Id == updatedModel.Id);

            return expandedUpdatedModel;
        }
    }
}