// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

using ModelRelief.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    /// Represents a GET request of a collection that supports paging.
    /// </summary>
    public class GetListRequest
    {
        /// <summary>
        /// Gets or sets the page number of the collection.
        /// </summary>
        public int PageNumber { get; set; } = 1;

        /// <summary>
        /// Gets or sets the number of records to receive.
        /// </summary>
        public int NumberOfRecords { get; set; } = 50;

        /// <summary>
        /// Gets or sets the propery name to sort the collection.
        /// </summary>
        public string OrderBy { get; set; } = nameof (DomainModel.Id);

        /// <summary>
        /// Gets or sets the order of the collectionn sort; ascending or descending.
        /// </summary>
        public bool Ascending { get; set; } = true;
    }
}
