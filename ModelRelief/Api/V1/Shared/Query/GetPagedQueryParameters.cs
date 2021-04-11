// -----------------------------------------------------------------------
// <copyright file="GetPagedQueryParameters.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using ModelRelief.Domain;

    /// <summary>
    /// Represents GET query parameters for a collection that supports paging.
    /// </summary>
    public class GetPagedQueryParameters
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
        public string OrderBy { get; set; } = nameof(DomainModel.Id);

        /// <summary>
        /// Gets or sets a value indicating whether gets or sets the order of the collectionn sort; ascending or descending.
        /// </summary>
        public bool Ascending { get; set; } = true;
    }
}
