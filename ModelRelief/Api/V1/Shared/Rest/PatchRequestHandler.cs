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
        /// <summary>
        /// Contstructor
        /// </summary>
        /// <param name="userManager">UserManager (ClaimsPrincipal -> ApplicationUser).</param>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="validators">All validators matching IValidator for the given request.</param>
        public PatchRequestHandler(UserManager<ApplicationUser> userManager, ModelReliefDbContext dbContext, IMapper mapper, IEnumerable<IValidator<PatchRequest<TEntity, TGetModel>>> validators)
            : base(userManager, dbContext, mapper, validators) {}

        /// <summary>
        /// Pre-handler; performns any initialization or setup required before the request is handled.
        /// </summary>
        /// <param name="message">Request object</param>
        /// <param name="cancellationToken">Token to allow asyn request to be cancelled.</param>
        /// <returns></returns>
        public override async Task PreHandle(PatchRequest<TEntity, TGetModel> message, CancellationToken cancellationToken) 
        { 
            await message.BuildUpdatedTGetModel(UserManager, Mapper); 
        }

        /// <summary>
        /// Handles a PUT model request.
        /// </summary>
        /// <param name="message">PUT request.</param>
        /// <param name="cancellationToken">Token to allow the async operation to be cancelled.</param>
        /// <returns></returns>
        public override async Task<TGetModel> OnHandle(PatchRequest<TEntity, TGetModel> message, CancellationToken cancellationToken)
        {
            // find target model
            var model = await message.BuildUpdatedDomainModel(UserManager);

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