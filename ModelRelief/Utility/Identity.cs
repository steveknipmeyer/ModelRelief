// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Identity;
using ModelRelief.Api.V1.Shared.Errors;
using ModelRelief.Domain;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;

namespace ModelRelief.Utility
{
    public static class Identity
    {
        // N.B. Must match TestAccount!
        public static string MockUserId { get {return "7ab4676b-563b-4c42-b6f9-27c11208f33f";} }
        public static string MockUserName { get {return "MockTestUser";} }

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
        /// Returns the current user from a ClaimsPrincipal.
        /// https://stackoverflow.com/questions/30701006/how-to-get-the-current-logged-in-user-id-asp-net-core
        /// </summary>
        /// <param name="userManager">User Manager from DI</param>
        /// <param name="claimsPrincipal">HttpContext.User</param>
        /// <returns>USer</returns>
        public static async Task<ApplicationUser> FindApplicationUserAsync (UserManager<ApplicationUser> userManager, ClaimsPrincipal claimsPrincipal)
        {
        if ((claimsPrincipal == null) || (!claimsPrincipal.Identity.IsAuthenticated))
            throw new UserAuthenticationException();

        // mock authentication to work with PostMan and xUnit; assign a User Id to the GenericIdentity that was created in the middleware
        if (claimsPrincipal.Identity.Name == Identity.MockUserName)
            return await userManager.FindByIdAsync(MockUserId);
        else        
            return await userManager.GetUserAsync(claimsPrincipal);
        }
    }        
}