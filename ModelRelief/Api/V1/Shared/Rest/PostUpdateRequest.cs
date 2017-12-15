﻿// ------------------------------------------------------------------------// 
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
    /// <typeparam name="TPostModel">The DTO POST model. Contains a model Id</typeparam>
    /// <typeparam name="TGetModel">The DTO GET model.</typeparam>
    /// <remarks>This request is used to update all the properties of an existing model.</remarks>
    public class PostUpdateRequest<TEntity, TPostModel, TGetModel> : IRequest<TGetModel>
        where TEntity    : DomainModel
        where TPostModel : ITGetModel
        where TGetModel  : ITGetModel
    {
        /// <summary>
        /// Gets or sets the User posting the PostUpdate request.
        /// </summary>
        public ClaimsPrincipal User { get; set;}

        /// <summary>
        /// Gets or sets the Id for the single model to be updated.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        ///  Gets or sets the incoming model to be used to update the existing model.
        /// </summary>
        public TPostModel UpdatedModel { get; set; }
    }
}
