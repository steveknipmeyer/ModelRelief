// -----------------------------------------------------------------------
// <copyright file="PostFileRequest.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using System.Security.Claims;
    using MediatR;
    using ModelRelief.Domain;
    using ModelRelief.Dto;

    /// <summary>
    ///  Represents a POST request of a file to create a model.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <typeparam name="TGetModel">The DTO GET model.</typeparam>
    /// <remarks>This request is used to create a new file that is a associated with a model.</remarks>
    public class PostFileRequest<TEntity, TGetModel> : BaseRequest, IRequest<TGetModel>
        where TEntity    : DomainModel
        where TGetModel  : IModel
    {
        /// <summary>
        /// Gets or sets the associated resource Id of the file.
        /// </summary>
        public int? Id { get; set; }

        /// <summary>
        ///  Gets or sets the incoming file to be used to create the new domain model.
        /// </summary>
        public PostFile NewFile { get; set; }
    }
}
