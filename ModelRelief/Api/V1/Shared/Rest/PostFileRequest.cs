﻿// ------------------------------------------------------------------------// 
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
   public class PostFileRequest<TEntity, TGetModel> : IRequest<TGetModel>
        where TEntity    : DomainModel
        where TGetModel  : IGetModel
    {
        /// <summary>
        /// Gets or sets the User posting the file request.
        /// </summary>
        public ClaimsPrincipal User { get; set;}

        /// <summary>
        ///  Gets or sets the incoming file to be used to create the new domain model.
        /// </summary>
        public PostFile NewFile { get; set; }
    }
}
