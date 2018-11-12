﻿// -----------------------------------------------------------------------
// <copyright file="AccountController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Accounts
{
    using System;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.DependencyInjection;
    using ModelRelief.Database;
    using ModelRelief.Domain;

    /// <summary>
    /// Account controller.
    /// </summary>
    public class AccountController : Controller
        {
        private readonly IServiceProvider _services;
        private UserManager<ApplicationUser>   _userManager;
        private SignInManager<ApplicationUser> _signInManager;

        /// <summary>
        /// Initializes a new instance of the <see cref="AccountController"/> class.
        /// </summary>
        /// <param name="userManager">UserManager.</param>
        /// <param name="signInManager">SignInManager.</param>
        /// <param name="services">IServiceProvider.</param>
        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IServiceProvider services)
            {
            _userManager  = userManager;
            _signInManager = signInManager;
            _services = services;
            }

        /// <summary>
        /// Action method for Register Get.
        /// </summary>
        [HttpGet]
        public IActionResult Register()
            {
            return View();
            }

        /// <summary>
        /// Action method for Register Post.
        /// </summary>
        /// <param name="model">RegisterViewModel containing user credentials.</param>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model)
            {
            if (!ModelState.IsValid)
                {
                // re-display with validation messages
                return View();
                }

            var user = new ApplicationUser() { UserName = model.Username };
            var createResult = await _userManager.CreateAsync(user, model.Password);
            if (!createResult.Succeeded)
                {
                foreach (var error in createResult.Errors)
                    {
                    ModelState.AddModelError(string.Empty, error.Description);
                    }
                // re-display with validation messages
                return View();
                }

            // success
            await _signInManager.SignInAsync(user, false);

            // examples
            var initializer = new DbInitializer(_services, false);
            initializer.SeedDatabaseForUser(user);

            return RedirectToAction("Index", "Home");
            }

        /// <summary>
        /// Action method for Logout.
        /// </summary>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
            {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Index", "Home");
            }

        /// <summary>
        /// Action method for Login Get.
        /// </summary>
        [HttpGet]
        public IActionResult Login()
            {
            return View();
            }

        /// <summary>
        /// Action method for Login Post.
        /// </summary>
        /// <param name="model">LoginViewModel containing user credentials.</param>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model)
            {
            if (!ModelState.IsValid)
                {
                // re-display with validation messages
                return View();
                }

            var loginResult = await _signInManager.PasswordSignInAsync(model.Username, model.Password, model.RememberMe, false);
            if (!loginResult.Succeeded)
                {
                ModelState.AddModelError(string.Empty, "Login was not successful. Please try again.");

                // re-display with validation messages
                return View();
                }
            if (Url.IsLocalUrl(model.ReturnUrl))
                {
                return Redirect(model.ReturnUrl);
                }
            else
                {
                return RedirectToAction("Index", "Home");
                }
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
