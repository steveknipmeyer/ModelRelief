// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

using MediatR;
using ModelRelief.Domain;
using System.Security.Claims;

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    ///  Represents a GET request for a single model.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <typeparam name="TGetModel">The DTO GET model.</typeparam>
    public class GetSingleRequest<TEntity, TGetModel> : IRequest<TGetModel>
        where TEntity   : DomainModel
        where TGetModel : ITGetModel
    {
        /// <summary>
        /// Gets or sets the User posting the GetSingle request.
        /// </summary>
        public ClaimsPrincipal User { get; set;}

        /// <summary>
        /// Gets or sets the Id for the single model to be returned.
        /// </summary>
        public int Id { get; set; }
    }
}
