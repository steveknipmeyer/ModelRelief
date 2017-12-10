// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using AutoMapper.QueryableExtensions;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Api.V1.Shared.Errors;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

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
        where TEntity    : DomainModel
        where TPostModel : IIdModel
        where TGetModel  : IIdModel
    {
        /// <summary>
        /// Contstructor
        /// </summary>
        /// <param name="userManager">UserManager (ClaimsPrincipal -> ApplicationUser).</param>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="validators">All validators matching IValidator for the given request.</param>
        public PostUpdateRequestHandler(UserManager<ApplicationUser> userManager, ModelReliefDbContext dbContext, IMapper mapper, IEnumerable<IValidator<PostUpdateRequest<TEntity, TPostModel, TGetModel>>> validators)
            : base(userManager, dbContext, mapper, validators)
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
            var user = await Identity.GetApplicationUserAsync(UserManager, message.User);
            var targetModel = await DbContext.Set<TEntity>()
                                .AsNoTracking()
                                .Where(m => (m.Id == message.UpdatedModel.Id) && 
                                            (m.UserId == user.Id))
                                .SingleOrDefaultAsync();

            if (targetModel == null)
                throw new EntityNotFoundException(typeof(TEntity), message.UpdatedModel.Id);

            // update database model
            var updatedModel = Mapper.Map<TEntity>(message.UpdatedModel);

             // set ownership
             updatedModel.User = await Identity.GetApplicationUserAsync(UserManager, message.User);

            DbContext.Set<TEntity>().Update(updatedModel);
            await DbContext.SaveChangesAsync(cancellationToken);

            // expand returned model
            var expandedUpdatedModel = await DbContext.Set<TEntity>()
                 .ProjectTo<TGetModel>(Mapper.ConfigurationProvider)
                 .SingleOrDefaultAsync(m => m.Id == updatedModel.Id);

            return expandedUpdatedModel;
        }
    }
}