// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Api.V2.Shared.Errors;
using ModelRelief.Database;
using ModelRelief.Domain;
using System.Threading;
using System.Threading.Tasks;

namespace ModelRelief.Api.V2.Shared.Rest
{
    /// <summary>
    /// Represents the concrete handler for a GET single model request.
    /// </summary>
    /// <typeparam name="TEntity">Domain model.</typeparam>
    /// <typeparam name="TGetModel">DTO Get model.</typeparam>
    public class GetSingleRequestHandler<TEntity, TGetModel>  : ValidatedHandler<GetSingleRequest<TEntity, TGetModel>, TGetModel>
        where TEntity   : ModelReliefModel
        where TGetModel : IGetModel
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        public GetSingleRequestHandler(ModelReliefDbContext dbContext, IMapper mapper)
            : base(dbContext, mapper, null)
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
            var result = await DbContext.Set<TEntity>()
                 .ProjectTo<TGetModel>(Mapper.ConfigurationProvider)
                .SingleOrDefaultAsync(m => m.Id == message.Id);

            if (result == null) {
                throw new EntityNotFoundException(typeof(TEntity), message.Id);
            }
            return result;
        }
    }
}