// -----------------------------------------------------------------------
// <copyright file="TestAuthentication.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Middleware
{
    using System;
    using System.Security.Principal;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using ModelRelief.Utility;

    public class TestAuthentication
    {
        public static async Task Test(IHostingEnvironment env, HttpContext context, Func<Task> next)
        {
            bool isAuthenticated = context.User.Identity.IsAuthenticated;
            // WIP: Authentication is always overridden.
            //      'dotnet run', used for 'hot reload' FE development cannot specify the environment 'Test' so API requests fail.
            // if (!isAuthenticated)
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
                // Console.WriteLine($"{Identity.MockUserName} authenticated: {isAuthenticated}");
            }

            await next();
        }
    }
}
