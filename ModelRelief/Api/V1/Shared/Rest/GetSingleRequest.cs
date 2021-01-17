// -----------------------------------------------------------------------
// <copyright file="GetSingleRequest.cs" company="ModelRelief">
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
    ///  Represents a GET request for a single model.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <typeparam name="TGetModel">The DTO GET model.</typeparam>
    public class GetSingleRequest<TEntity, TGetModel> : IRequest<TGetModel>
        where TEntity   : DomainModel
        where TGetModel : IModel
    {
        /// <summary>
        /// Gets or sets the User posting the GetSingle request.
        /// </summary>
        public ClaimsPrincipal User { get; set; }

        /// <summary>
        /// Gets or sets the Id for the single model to be returned.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the Name for the single model to be returned.
        /// Optionally provided by a query parameter.
        /// </summary>
        public string Name { get; set; }
    }
}
