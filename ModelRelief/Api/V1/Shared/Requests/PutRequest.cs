// -----------------------------------------------------------------------
// <copyright file="PutRequest.cs" company="ModelRelief">
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
    ///  Represents a POST request to update a model.
    /// </summary>
    /// <remarks>All properties are updated.</remarks>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <typeparam name="TRequestModel">The DTO PUT model. Contains a model Id</typeparam>
    /// <typeparam name="TGetModel">The DTO GET model.</typeparam>
    /// <remarks>This request is used to update all the properties of an existing model.</remarks>
    public class PutRequest<TEntity, TRequestModel, TGetModel> : BaseRequest, IRequest<TGetModel>
        where TEntity    : DomainModel
        where TGetModel  : IModel
    {
        /// <summary>
        /// Gets or sets the Id for the single model to be updated.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        ///  Gets or sets the incoming model to be used to update the existing model.
        /// </summary>
        public TRequestModel UpdatedModel { get; set; }
    }
}
