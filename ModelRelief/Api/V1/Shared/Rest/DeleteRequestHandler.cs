// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Api.V1.Shared.Errors;
using ModelRelief.Database;
using ModelRelief.Domain;
using System.Threading;
using System.Threading.Tasks;

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    /// Represents the concrete handler for a DELETE model request.
    /// </summary>
    /// <typeparam name="TEntity">Domain model.</typeparam>
    public class DeleteRequestHandler<TEntity>  : ValidatedHandler<DeleteRequest<TEntity>, object>
        where TEntity   : DomainModel
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        public DeleteRequestHandler(ModelReliefDbContext dbContext, IMapper mapper)
            : base(dbContext, mapper, null)
        {
        }

        /// <summary>
        /// Handles the DELETE model request.
        /// </summary>
        /// <param name="message">Request message</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// <returns></returns>
        public override async Task<object> OnHandle(DeleteRequest<TEntity> message, CancellationToken cancellationToken)
        {
            var modelToRemove = await DbContext.Set<TEntity>().FindAsync(message.Id);

            if (modelToRemove == null) {
                throw new EntityNotFoundException(typeof(TEntity), message.Id);
            }

            DbContext.Remove(modelToRemove);

            return null;
        }
    }
}