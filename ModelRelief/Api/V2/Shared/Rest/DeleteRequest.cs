// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using MediatR;
using ModelRelief.Domain;

namespace ModelRelief.Api.V2.Shared.Rest
{
    /// <summary>
    ///  Represents a DELETE request for a single model.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// WIP Why does DeleteRequest return an object?
    public class DeleteRequest<TEntity> : IRequest<object>
        where TEntity   : ModelReliefModel
    {
        /// <summary>
        /// Gets or sets the Id for the single model to be deleted.
        /// </summary>
        public int Id { get; set; }
    }
}
