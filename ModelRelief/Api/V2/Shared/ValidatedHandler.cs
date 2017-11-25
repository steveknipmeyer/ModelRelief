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

namespace ModelRelief.Api.V2.Shared
{
    /// <summary>
    /// Abstract representation of request handler that supports validation.
    /// </summary>
    /// <typeparam name="TRequest">Request object.</typeparam>
    /// <typeparam name="TResponse">Response object.</typeparam>
    public abstract class ValidatedHandler<TRequest, TResponse> : ICancellableAsyncRequestHandler<TRequest, TResponse> 
        where TRequest : IRequest<TResponse>
    {
        public ModelReliefDbContext DbContext { get; }
        public IMapper Mapper { get; }

        public IEnumerable<IValidator<TRequest>> Validators { get; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="validators">List of validators</param>
        public ValidatedHandler(ModelReliefDbContext dbContext, IMapper mapper, IEnumerable<IValidator<TRequest>> validators)
        {
            DbContext = dbContext ?? throw new System.ArgumentNullException(nameof(dbContext));
            Mapper = mapper ?? throw new System.ArgumentNullException(nameof(mapper));

            // WIP Why are duplicate validators injected here?
            //     Remove duplicates by grouping by Type name.
            Validators = validators
                .GroupBy(v => v.GetType().Name)
                .Select(group => group.First());
        }

        /// <summary>
        /// Validation pre-processor for request.
        /// </summary>
        /// <param name="message">Request object</param>
        /// <param name="cancellationToken">Token to allow asyn request to be cancelled.</param>
        /// <returns></returns>
        public async Task<TResponse> Handle(TRequest message, CancellationToken cancellationToken)
        {
            // All request validators will run through here first before moving onto the OnHandle request.
            if (Validators != null)
            {
                // WIP Exactly how does this LINQ produce a list of errors?
                var validationResult = (await Task.WhenAll(Validators
                    .Where(v => v != null)
                    .Select(v => v.ValidateAsync(message))))
                    .SelectMany(v => v.Errors);

                if (validationResult.Any())
                {
                    throw new ValidationException(validationResult);
                }
            }
            return await OnHandle(message, cancellationToken);
        }

        /// <summary>
        /// Abstract handler; implemented in concrete class.
        /// </summary>
        /// <param name="message">Request object</param>
        /// <param name="cancellationToken">Token to allow asyn request to be cancelled.</param>
        /// <returns></returns>
        public abstract Task<TResponse> OnHandle(TRequest message, CancellationToken cancellationToken);
    }
}