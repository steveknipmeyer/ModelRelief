// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using MediatR;
using ModelRelief.Domain;
using ModelRelief.Dto;
using System.Security.Claims;

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    ///  Represents a POST request of a file to create a model.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <typeparam name="TGetModel">The DTO GET model.</typeparam>
    /// <remarks>This request is used to create a new file that is a associated with a model.</remarks>
   public class PostFileRequest<TEntity, TGetModel> : IRequest<TGetModel>
        where TEntity    : DomainModel
        where TGetModel  : IIdModel
    {
        /// <summary>
        /// Gets or sets the User posting the PostFile request.
        /// </summary>
        public ClaimsPrincipal User { get; set;}

        /// <summary>
        ///  Gets or sets the incoming file to be used to create the new domain model.
        /// </summary>
        public PostFile NewFile { get; set; }
    }
}
