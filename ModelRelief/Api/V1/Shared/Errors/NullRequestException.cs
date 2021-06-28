// -----------------------------------------------------------------------
// <copyright file="NullRequestException.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Errors
{
    using System;

    /// <summary>
    ///  Represents an exception when a CQRS request is null.
    /// </summary>
    public class NullRequestException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="NullRequestException"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="requestPath">HTTP endpoint that led to the exception.</param>
        /// <param name="request">Type of the request.</param>
        public NullRequestException(string requestPath, Type request)
            : base($"{requestPath} received an empty {request.Name}.")
        {
        }
    }
}
