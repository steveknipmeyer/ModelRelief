// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;

namespace ModelRelief.Utility
{
    public static class Identity
    {
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
    }        
}