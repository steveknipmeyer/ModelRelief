// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Identity;
using ModelRelief.Domain;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;

namespace ModelRelief.Utility
{
    public static class Identity
    {
        public static string MockUserId { get {return "7ab4676b-563b-4c42-b6f9-27c11208f33f";} }

        /// <summary>
        /// IPrincipal extension method to retrieve the User Id.
        /// https://stackoverflow.com/questions/38543193/proper-way-to-get-current-user-id-in-entity-framework-core
        /// </summary>
        /// <param name="principal">User</param>
        /// <returns>User Id</returns>
        public static string GetUserId(this IPrincipal principal)
        {
            var claimsIdentity = (ClaimsIdentity)principal.Identity;
            var claim = claimsIdentity.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            return claim.Value;
        }

        /// <summary>
        /// Returns the current user from the HttpContext.User.
        /// https://stackoverflow.com/questions/30701006/how-to-get-the-current-logged-in-user-id-asp-net-core
        /// </summary>
        /// <param name="userManager">User Manager from DI</param>
        /// <param name="claimsPrincipal">HttpContext.User</param>
        /// <returns>USer</returns>
        public static async Task<ApplicationUser> GetCurrentUserAsync (UserManager<ApplicationUser> userManager, ClaimsPrincipal claimsPrincipal) =>
        #if false
            await userManager.GetUserAsync(claimsPrincipal);
        #else
            // mock authentication to work with PostMan and xUnit
            await userManager.FindByIdAsync(MockUserId);
        #endif
    }        
}