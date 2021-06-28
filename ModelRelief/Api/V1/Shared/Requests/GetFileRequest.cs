// -----------------------------------------------------------------------
// <copyright file="GetFileRequest.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using System.Security.Claims;
    using MediatR;
    using Microsoft.AspNetCore.Mvc;
    using ModelRelief.Domain;

    /// <summary>
    ///  Represents a GET request for a single file.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    public class GetFileRequest<TEntity> : BaseRequest, IRequest<FileContentResult>
        where TEntity   : DomainModel
    {
        /// <summary>
        /// Gets or sets the Id for the single file to be returned.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the type of file requested.
        /// </summary>
        public GetFileType FileType { get; set; }

        /// <summary>
        /// Gets or sets the query parameters.
        /// </summary>
        public GetFileQueryParameters QueryParameters { get; set; }
    }
}
