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

namespace ModelRelief.Api.V2.Shared.Rest
{
    /// <summary>
    /// Represents a handler for a POST request to create a new model.
    /// </summary>
    /// <typeparam name="TEntity">Domain model</typeparam>
    /// <typeparam name="TGetModel">DTO GET model.</typeparam>
    public class PostFileRequestHandler<TEntity, TGetModel> : ValidatedHandler<PostFileRequest<TEntity, TGetModel>, TGetModel>
        where TEntity    : ModelReliefModel, IFileResource, new()
        where TGetModel  : IGetModel
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="validators">All validators matching IValidator for the given request.</param>
        public PostFileRequestHandler(ModelReliefDbContext dbContext, IMapper mapper, IEnumerable<IValidator<PostFileRequest<TEntity, TGetModel>>> validators)
            : base(dbContext, mapper, validators)
        {
        }

        /// <summary>
        /// Handles a POST file request.
        /// </summary>
        /// <param name="message">POST file request.</param>
        /// <param name="cancellationToken">Token to allow the async operation to be cancelled.</param>
        /// <returns></returns>
        public override async Task<TGetModel> OnHandle(PostFileRequest<TEntity, TGetModel> message, CancellationToken cancellationToken)
        {
            var newModel = new TEntity();
            newModel.Name = "Temp";

            DbContext.Set<TEntity>().Add(newModel);
            await DbContext.SaveChangesAsync(cancellationToken);

            return Mapper.Map<TGetModel>(newModel);
        }
    }
}