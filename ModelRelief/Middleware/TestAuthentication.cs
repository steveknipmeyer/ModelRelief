// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.FileProviders;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using ModelRelief.Utility;
using System.Security.Principal;

namespace ModelRelief.Middleware
    {
    public class Authentication
    {
        public static async Task Test (IHostingEnvironment env, HttpContext context, Func<Task> next)
        {
            bool isAuthenticated = context.User.Identity.IsAuthenticated;
            if (env.IsEnvironment("Test") && !isAuthenticated)
            {
                context.User = new System.Security.Claims.ClaimsPrincipal(new GenericIdentity(Identity.MockUserName));
#if false
                // WIP: Creating a ClaimsPrincipal here yields an exception about access of a Disposed object.    
                var userName = configurationProvider.GetSetting("TestAccount:UserName");
                var password = configurationProvider.GetSetting("TestAccount:Password");

                var user = await userManager.FindByNameAsync(userName);
                ClaimsPrincipal claimsPrincipal = await signInManager.CreateUserPrincipalAsync(user);
                context.User = new System.Security.Claims.ClaimsPrincipal(claimsPrincipal);
#endif                    
                isAuthenticated = context.User.Identity.IsAuthenticated;
                Console.WriteLine($"{Identity.MockUserName} authenticated: {isAuthenticated}");
            }

            await next();
        }
    }
}
