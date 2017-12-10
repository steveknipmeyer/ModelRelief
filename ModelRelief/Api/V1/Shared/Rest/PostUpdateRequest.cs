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
    ///  Represents a POST request to update a model. 
    /// </summary>
    /// <remarks>All properties are updated.</remarks>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <typeparam name="TPostModel">The DTO POST model.</typeparam>
    /// <typeparam name="TGetModel">The DTO GET model.</typeparam>
    public class PostUpdateRequest<TEntity, TPostModel, TGetModel> : IRequest<TGetModel>
        where TEntity    : DomainModel
        where TPostModel : IIdModel
        where TGetModel  : IIdModel
    {
        /// <summary>
        /// Gets or sets the User posting the PostUpdate request.
        /// </summary>
        public ClaimsPrincipal User { get; set;}

        /// <summary>
        ///  Gets or sets the incoming model to be used to update the existing model.
        /// </summary>
        public TPostModel UpdatedModel { get; set; }
    }
}
