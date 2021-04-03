// -----------------------------------------------------------------------
// <copyright file="BaseRequest.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using System.Security.Claims;
    using System.Threading.Tasks;
    using MediatR;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
    using ModelRelief.Utility;

    /// <summary>
    ///  Represents a base request for a MediatR request.
    /// </summary>
    public class BaseRequest
    {
        /// <summary>
        /// Gets or sets the User originating the request.
        /// </summary>
        public ClaimsPrincipal User { get; set; }

        /// <summary>
        /// Returns the ApplicationUser of the request.
        /// </summary>
        /// <returns>ApplicationUser</returns>
        public async Task<ApplicationUser> ApplicationUser()
        {
            return await IdentityUtility.FindApplicationUserAsync(User);
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="BaseRequest"/> class.
        /// Constructor
        /// </summary>
        public BaseRequest()
        {
        }
    }
}
