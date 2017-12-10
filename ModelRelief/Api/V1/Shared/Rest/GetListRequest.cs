// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using MediatR;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Domain;
using System.Security.Claims;

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    ///  Represents a GET request for a collection of models.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <typeparam name="TGetModel">The DTO model in the collection.</typeparam>
    public class GetListRequest<TEntity, TGetModel> : IRequest<object>
        where TEntity   : DomainModel
        where TGetModel : IIdModel
    {
        /// <summary>
        /// Gets or sets the User posting the GetList request.
        /// </summary>
        public ClaimsPrincipal User { get; set;}

        /// <summary>
        /// UrlHelper from the active controller; used for generating paging links.
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
        public string OrderBy { get; set; } = nameof (DomainModel.Id);

        /// <summary>
        /// Gets or sets the order of the collectionn sort; ascending or descending.
        /// </summary>
        public bool Ascending { get; set; } = true;

        /// <summary>
        /// Gets or sets whether to use paging in the returned collection.
        /// </summary>
        public bool UsePaging { get; set; }
    }
}
