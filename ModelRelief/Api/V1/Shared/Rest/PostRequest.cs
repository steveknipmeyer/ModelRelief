// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using MediatR;
using ModelRelief.Domain;
using System.Security.Claims;

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    ///  Represents a POST request to create a model.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <typeparam name="TPostModel">The DTO POST model.  Does not contain an Id because it is assigned.</typeparam>
    /// <typeparam name="TGetModel">The DTO GET model.</typeparam>
    /// <remarks>This request is used to create a new model.</remarks>
    public class PostRequest<TEntity, TPostModel, TGetModel> : IRequest<TGetModel>
        where TEntity    : DomainModel
        where TGetModel  : ITGetModel
    {
        /// <summary>
        /// Gets or sets the User posting the PostRequest.
        /// </summary>
        public ClaimsPrincipal User { get; set;}

        /// <summary>
        ///  Gets or sets the incoming model to be used to create the new domain model.
        /// </summary>
        public TPostModel NewModel { get; set; }
    }
}
