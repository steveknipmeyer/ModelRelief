// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using FluentValidation;
using ModelRelief.Database;
using ModelRelief.Domain;
using System.Threading;
using System.Threading.Tasks;

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

            // N.B. Existence could be tested in validators if <all> requests, including Get and Delete requests, had FV validators defined.
            //      Currently, only requests that modify the database (PatchRequest, PostAddRequest, PostUpdateRequest) have validators defined.
            //      Also a specialized type of RequestValidator would be needed that used a generic type parameter (e.g. IExistingModelRequest) 
            //      to ensure that the User and Id properties are present in the request.
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