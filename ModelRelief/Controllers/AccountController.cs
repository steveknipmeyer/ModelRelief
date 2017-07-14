﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using ModelRelief.ViewModels;
using ModelRelief.Entitities;

namespace ModelRelief.Controllers
        {
    public class AccountController : Controller
        {
        private UserManager<User>   _userManager;
        private SignInManager<User> _signInManger;

        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager)
            {
            _userManager  = userManager;
            _signInManger = signInManager;
            }

        [HttpGet]
        public IActionResult Register()
            {
            return View();
            }

        [HttpPost, ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model)
            {
            if (!ModelState.IsValid)
                {
                // re-display with validation messages
                return View();
                }

            var user = new User() { UserName = model.Username};
            var createResult = await _userManager.CreateAsync (user, model.Password);
            if (!createResult.Succeeded)
                {
                foreach (var error in createResult.Errors)
                    {
                    ModelState.AddModelError("", error.Description);
                    }
                // re-display with validation messages
                return View();               
                }

            // success
            await _signInManger.SignInAsync(user, false);
            return RedirectToAction("Index", "Home");
            }

        [HttpGet]
        public IActionResult Login()
            {
            return View();
            }

        [HttpPost, ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model)
            {
            if (!ModelState.IsValid)
                {
                // re-display with validation messages
                return View();
                }
            
            var loginResult = await _signInManger.PasswordSignInAsync(model.Username, model.Password, model.RememberMe, false);
            if (!loginResult.Succeeded)
                {
                ModelState.AddModelError("", "Login was not successful. Please try again.");

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
        }
    }
