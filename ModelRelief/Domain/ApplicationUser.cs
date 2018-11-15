// -----------------------------------------------------------------------
// <copyright file="ApplicationUser.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    using System.Security.Claims;
    using Microsoft.AspNetCore.Identity;
    using ModelRelief.Utility;

    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }                    // friendly name or e-mail
        public string NameIdentifier { get; set; }          // unique Auth0 ID: provider:id

        public ApplicationUser()
        {
        }

        public ApplicationUser(ClaimsPrincipal user)
        {
            Name = IdentityUtility.GetUserClaim(user, System.Security.Claims.ClaimTypes.Name);
            NameIdentifier = IdentityUtility.GetUserClaim(user, System.Security.Claims.ClaimTypes.NameIdentifier);
        }

        /// <summary>
        /// Gets the unique ID for the ClaimsPrincipal.
        /// </summary>
        public string IdX
        {
            get
            {
                // remove (illegal) pipe character
                var id = NameIdentifier.Replace("|", string.Empty);
                return NameIdentifier;
            }
        }
    }
}