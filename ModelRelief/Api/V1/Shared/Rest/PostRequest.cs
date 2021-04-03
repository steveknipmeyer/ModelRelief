// -----------------------------------------------------------------------
// <copyright file="PostRequest.cs" company="ModelRelief">
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
    ///  Represents a POST request to create a model.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <typeparam name="TRequestModel">The DTO POST model.  Does not contain an Id because it is assigned.</typeparam>
    /// <typeparam name="TGetModel">The DTO GET model.</typeparam>
    /// <remarks>This request is used to create a new model.</remarks>
    public class PostRequest<TEntity, TRequestModel, TGetModel> : BaseRequest, IRequest<TGetModel>
        where TEntity    : DomainModel
        where TGetModel  : IModel
    {
        /// <summary>
        ///  Gets or sets the incoming model to be used to create the new domain model.
        /// </summary>
        public TRequestModel NewModel { get; set; }
    }
}
