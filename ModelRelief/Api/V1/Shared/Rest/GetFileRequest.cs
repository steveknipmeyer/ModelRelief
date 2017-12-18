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
    ///  Represents a GET request for a single file.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    public class GetFileRequest<TEntity> : IRequest<object>
        where TEntity   : DomainModel
    {
        /// <summary>
        /// Gets or sets the User posting the GetFile request.
        /// </summary>
        public ClaimsPrincipal User { get; set;}

        /// <summary>
        /// Gets or sets the Id for the single file to be returned.
        /// </summary>
        public int Id { get; set; }
    }
}
