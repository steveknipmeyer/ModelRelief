using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.ViewModels;

namespace ModelRelief.Controllers
        {
    public class AccountController : Controller
        {
        [HttpGet]
        public IActionResult Register()
            {
            return View();
            }

        [HttpPost, ValidateAntiForgeryToken]
        public IActionResult Register(RegisterViewModel model)
            {
            if (!ModelState.IsValid)
                {
                // re-display with validation messages
                return View();
                }
            return View();
            }
        }
    }
