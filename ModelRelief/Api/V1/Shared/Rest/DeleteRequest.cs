// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using MediatR;
using ModelRelief.Domain;

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    ///  Represents a DELETE request for a single model.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <remarks>The returned object (always null) is not used. It is later passed to OK(response) where is generates a 204 (Success:No Content) return result.</remarks>
    public class DeleteRequest<TEntity> : IRequest<object>
        where TEntity   : DomainModel
    {
        /// <summary>
        /// Gets or sets the Id for the single model to be deleted.
        /// </summary>
        public int Id { get; set; }
    }
}
