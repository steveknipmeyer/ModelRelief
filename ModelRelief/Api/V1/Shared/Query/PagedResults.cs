// -----------------------------------------------------------------------
// <copyright file="PagedResults.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using System.Collections.Generic;

    public class PagedResults<T>
    {
        /// <summary>
        /// Gets or sets the page number this page represents.
        /// </summary>
        public int PageNumber { get; set; }

        /// <summary>
        /// Gets or sets the size of this page.
        /// </summary>
        public int PageSize { get; set; }

        /// <summary>
        /// Gets or sets the total number of pages available.
        /// </summary>
        public int TotalNumberOfPages { get; set; }

        /// <summary>
        /// Gets or sets the total number of records available.
        /// </summary>
        public int TotalNumberOfRecords { get; set; }

        /// <summary>
        /// Gets or sets the URL to the next page - if null, there are no more pages.
        /// </summary>
        public string NextPageUrl { get; set; }

        /// <summary>
        /// Gets or sets the records this page represents.
        /// </summary>
        public IEnumerable<T> Results { get; set; }
    }
}