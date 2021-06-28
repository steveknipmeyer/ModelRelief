// -----------------------------------------------------------------------
// <copyright file="GetSingleRequest.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
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
    public class GetSingleRequest<TEntity, TGetModel> : BaseRequest, IRequest<TGetModel>
        where TEntity   : DomainModel
        where TGetModel : IModel
    {
        /// <summary>
        /// Gets or sets the Id for the single model to be returned.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the query parameters.
        /// </summary>
        public GetQueryParameters QueryParameters { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="GetSingleRequest{TEntity, TGetModel}"/> class.
        /// Constructor
        /// </summary>
        public GetSingleRequest()
        {
        }
    }
}
