// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Api.V2.Shared.Rest
{
    /// <summary>
    /// Represents a GET request of a collection that supports paging.
    /// </summary>
    public class GetRequest
    {
        /// <summary>
        /// Gets or sets the page number of the collection.
        /// </summary>
        public int PageNumber { get; set; } = 1;

        /// <summary>
        /// Gets or sets the number of records to receive.
        /// </summary>
        public int NumberOfRecords { get; set; } = 50;
    }
}
