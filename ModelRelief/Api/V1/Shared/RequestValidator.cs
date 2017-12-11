// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using MediatR;
using ModelRelief.Database;
using ModelRelief.Domain;

namespace ModelRelief.Api.V1.Shared
{
    /// <summary>
    /// Abstract representation of a REST request validator.
    /// </summary>
    /// <typeparam name="TRequest"></typeparam>
    public abstract class RequestValidator<TRequest> : AbstractValidator<TRequest>
    {
        public ModelReliefDbContext DbContext { get; set; }

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public RequestValidator(ModelReliefDbContext dbContext)
        {
            DbContext = dbContext;

            // N.B. Existence cannot be tested here. A RequestValidator 
        }

        /// <summary>
        /// Determines if a given model exists.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="id">Primary key of model.</param>
        /// <param name="cancellationToken">Token to allow async request to be cancelled.</param>
        /// <returns>True if model exists.</returns>
        protected async Task<bool> ExistAsync<TEntity>(int id, CancellationToken cancellationToken)
            where TEntity : DomainModel
        {
            return (await DbContext.Set<TEntity>().FindAsync(new object[] {id}, cancellationToken)) != null;
        }
    }
}