// -----------------------------------------------------------------------
// <copyright file="AccountController.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Accounts
{
    using System;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authentication;
    using Microsoft.AspNetCore.Authentication.Cookies;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using ModelRelief.Database;

    /// <summary>
    /// Account controller.
    /// </summary>
    public class AccountController : Controller
        {
        private readonly IDbFactory _dbFactory;

        /// <summary>
        /// Initializes a new instance of the <see cref="AccountController"/> class.
        /// </summary>
        /// <param name="dbFactory">IDBFactory.</param>
        public AccountController(IDbFactory dbFactory)
            {
            _dbFactory = dbFactory ?? throw new ArgumentNullException(nameof(dbFactory));
            }

        /// <summary>
        /// Action method for Login.
        /// </summary>
        /// <param name="returnUrl">Return Url after successful login.</param>
        public async Task Login(string returnUrl = "/Account/LoginComplete")
        {
            await HttpContext.ChallengeAsync("Auth0", new AuthenticationProperties() { RedirectUri = returnUrl });
        }

        /// <summary>
        /// Action method for LoginComplete.
        /// </summary>
        public async Task<RedirectResult> LoginComplete()
        {
            await _dbFactory.SeedDatabaseForNewUserAsync(this.User);

            return Redirect("/");
        }

        /// <summary>
        /// Action method for Logout.
        /// </summary>
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize]
        public async Task Logout()
        {
            await HttpContext.SignOutAsync("Auth0", new AuthenticationProperties
            {
                // Indicate here where Auth0 should redirect the user after a logout.
                // Note that the resulting absolute Uri must be whitelisted in the **Allowed Logout URLs** settings for the client.
                RedirectUri = Url.Action("Index", "Home"),
            });
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }

        /// <summary>
        /// Action method for Manager Get.
        /// </summary>
        [HttpGet]
        public IActionResult Manage()
        {
            return View();
        }
    }
}
