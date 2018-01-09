// -----------------------------------------------------------------------
// <copyright file="PatchRequest.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using System.Collections.Generic;
    using System.Security.Claims;
    using MediatR;
    using ModelRelief.Database;
    using ModelRelief.Domain;

    /// <summary>
    ///  Represents a PUT request to update the properties of a model.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <typeparam name="TGetModel">The DTO GET model.</typeparam>
    /// <remarks>This request is used to update a subset of the properties of an existing model.</remarks>
    public class PatchRequest<TEntity, TGetModel> : IRequest<TGetModel>
        where TEntity   : DomainModel
        where TGetModel : ITGetModel
    {
        /// <summary>
        /// Gets or sets the User posting the Put request.
        /// </summary>
        public ClaimsPrincipal User { get; set; }

        /// <summary>
        /// Gets or sets the Id of the model to update.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the Dictionary of key:values to use to update the model properties.
        /// </summary>
        public Dictionary<string, object> Parameters { get; set; }

        /// <summary>
        /// Gets or sets the Database context.
        /// </summary>
        public ModelReliefDbContext DbContext  { get; set; }

        /// <summary>
        /// Gets or sets the updated model after applying the collection of incoming properties to the domain model.
        /// </summary>
        public TGetModel UpdatedModel { get; set; }
    }
}
