// -----------------------------------------------------------------------
// <copyright file="IdentityUtility.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Utility
{
    using System.Collections.Generic;
    using System.Security.Claims;
    using System.Security.Principal;
    using System.Threading.Tasks;
    using ModelRelief.Api.V1.Shared.Errors;
    using ModelRelief.Domain;

    public static class IdentityUtility
    {
        // N.B. Must match DevelopmentAccount!
        public static string DevelopmentUserId
        {
            get { return "auth05bedab58aa237e078600530b"; }
        }

        /// <summary>
        /// IPrincipal extension method to retrieve a Claim.
        /// https://stackoverflow.com/questions/38543193/proper-way-to-get-current-user-id-in-entity-framework-core
        /// </summary>
        /// <param name="principal">User</param>
        /// <param name="claimType">System.Security.Claims.ClaimTypes</param>
        /// <returns>Claim value.</returns>
        public static string GetUserClaim(IPrincipal principal, string claimType)
        {
            var claimsIdentity = (ClaimsIdentity)principal.Identity;
            var claim = claimsIdentity.FindFirst(claimType);

            return claim?.Value ?? string.Empty;
        }

        /// <summary>
        /// Returns the current user from a ClaimsPrincipal.
        /// </summary>
        /// <param name="claimsPrincipal">HttpContext.User</param>
        /// <returns>USer</returns>
        public static async Task<ApplicationUser> FindApplicationUserAsync(ClaimsPrincipal claimsPrincipal)
        {
            if ((claimsPrincipal == null) || (!claimsPrincipal.Identity.IsAuthenticated))
                throw new UserAuthenticationException();

            var applicationUser = new ApplicationUser(claimsPrincipal);
            await Task.CompletedTask;

            return applicationUser;
        }

        /// <summary>
        ///  Synthesize a ClaimsPrincipal from an ApplicationUser
        /// </summary>
        /// <param name="user">Application user</param>
        /// <returns>true if all entities are valid</returns>
        public static ClaimsPrincipal ConstructClaimsPrincipal(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.NameIdentifier),
                new Claim(ClaimTypes.Name, user.Name),
            };
            var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims, "Basic"));
            return claimsPrincipal;
        }
    }
}