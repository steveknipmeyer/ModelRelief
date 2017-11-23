// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using MediatR;
using ModelRelief.Domain;

namespace ModelRelief.Api.V2.Shared.Rest
{
    /// <summary>
    ///  Represents a GET request for a collection of models.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <typeparam name="TGetModel">The DTO model in the collection.</typeparam>
    public class GetListRequest<TEntity, TGetModel> : IRequest<object>
        where TEntity   : ModelReliefModel
        where TGetModel : IGetModel
    {
        /// <summary>
        /// Gets or sets the page number to fetch.
        /// </summary>
        public int PageNumber { get; set; }

        /// <summary>
        /// Gets or sets the number of records to return in the page.
        /// </summary>
        public int NumberOfRecords { get; set; }

        /// <summary>
        /// Gets or sets whether to use paging in the returned collection.
        /// </summary>
        public bool UsePaging { get; set; }
    }
}
