// -----------------------------------------------------------------------
// <copyright file="LoginLogoutViewComponent.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Shared.ViewComponents
{
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;

    public class LoginLogoutViewComponent : ViewComponent
        {
        // This async method lacks 'await' operators and will run synchronously. Consider using the 'await' operator to await non-blocking API calls, or 'await Task.Run(...)' to do CPU-bound work on a background thread.
        public async Task<IViewComponentResult> InvokeAsync(string viewTitle)
            {
            await Task.CompletedTask;
            if (User.Identity.IsAuthenticated)
                return View("Logout");

            switch (viewTitle)
            {
                case "Login":
                    return View("Register");
                case "Register":
                    return View("Login");
                default:
                    return View("Default");
            }
        }
    }
}