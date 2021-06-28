// -----------------------------------------------------------------------
// <copyright file="GetMultipleRequest.cs" company="ModelRelief">
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
    ///  Represents a GET query request for a collection of models.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <typeparam name="TGetModel">The DTO model in the collection.</typeparam>
    /// <remarks>Returned request object is a PagedResult which contains a collection of TGetModel.</remarks>
    public class GetMultipleRequest<TEntity, TGetModel> : BaseRequest, IRequest<object>
        where TEntity   : DomainModel
        where TGetModel : IModel
    {
        /// <summary>
        /// Gets or sets the UrlHelper from the active controller; used for generating paging links.
        /// </summary>
        public IUrlHelperContainer UrlHelperContainer { get; set; }

        /// <summary>
        /// Gets or sets the page number to fetch.
        /// </summary>
        public int PageNumber { get; set; }

        /// <summary>
        /// Gets or sets the number of records to return in the page.
        /// </summary>
        public int NumberOfRecords { get; set; }

        /// <summary>
        /// Gets or sets the propery name to sort the collection.
        /// </summary>
        public string OrderBy { get; set; } = nameof(DomainModel.Id);

        /// <summary>
        /// Gets or sets a value indicating whether the order of the collectionn sort; ascending or descending.
        /// </summary>
        public bool Ascending { get; set; } = true;

        /// <summary>
        /// Gets or sets a value indicating whether to use paging in the returned collection.
        /// </summary>
        public bool UsePaging { get; set; }

        /// <summary>
        /// Gets or sets the query parameters.
        /// </summary>
        public GetQueryParameters QueryParameters { get; set; }
    }
}
