// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Api.V1.Shared.Errors;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Utility;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    /// Represents the concrete handler for a GET single model request.
    /// </summary>
    /// <typeparam name="TEntity">Domain model.</typeparam>
    /// <typeparam name="TGetModel">DTO Get model.</typeparam>
    public class GetSingleRequestHandler<TEntity, TGetModel>  : ValidatedHandler<GetSingleRequest<TEntity, TGetModel>, TGetModel>
        where TEntity   : DomainModel
        where TGetModel : IIdModel
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="userManager">UserManager (ClaimsPrincipal -> ApplicationUser).</param>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        public GetSingleRequestHandler(UserManager<ApplicationUser> userManager, ModelReliefDbContext dbContext, IMapper mapper)
            : base(userManager, dbContext, mapper, null)
        {
        }

        /// <summary>
        /// Handles the Get single model request.
        /// </summary>
        /// <param name="message">Request message</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// <returns></returns>
        public override async Task<TGetModel> OnHandle(GetSingleRequest<TEntity, TGetModel> message, CancellationToken cancellationToken)
        {
            var user = await Identity.GetApplicationUserAsync(UserManager, message.User);
            var result = await DbContext.Set<TEntity>()
                                .Where(m => (m.Id == message.Id) && 
                                            (m.UserId == user.Id))
                                .ProjectTo<TGetModel>(Mapper.ConfigurationProvider)
                                .SingleOrDefaultAsync();

            if (result == null)
                throw new EntityNotFoundException(typeof(TEntity), message.Id);

            return result;
        }
    }
}