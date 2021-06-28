// -----------------------------------------------------------------------
// <copyright file="ApplicationUser.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    using System.Security.Claims;
    using ModelRelief.Utility;

    public class ApplicationUser
    {
        public string Name { get; set; }                    // friendly name or e-mail
        public string NameIdentifier { get; set; }          // unique Auth0 ID: provider:id

        public ApplicationUser()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ApplicationUser"/> class.
        /// </summary>
        /// <param name="user">ClaimsPrincipal</param>
        public ApplicationUser(ClaimsPrincipal user)
        {
            NameIdentifier = IdentityUtility.GetUserClaim(user, ClaimTypes.NameIdentifier);
            Name = user.Identity.Name;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ApplicationUser"/> class.
        /// </summary>
        /// <param name="nameIdentifier">Unique Auth0 user Id.</param>
        /// <param name="name">Friendly name or e-mail.</param>
        public ApplicationUser(string nameIdentifier, string name)
        {
            NameIdentifier = nameIdentifier;
            Name = name;
        }

        /// <summary>
        /// Gets the unique ID for the ClaimsPrincipal.
        /// </summary>
        public string Id
        {
            get
            {
                // remove (illegal) pipe character
                var id = NameIdentifier.Replace("|", string.Empty);
                return id;
            }
        }
    }
}