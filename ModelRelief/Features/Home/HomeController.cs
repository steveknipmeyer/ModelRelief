// -----------------------------------------------------------------------
// <copyright file="HomeController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Home
{
    using System;
    using Microsoft.AspNetCore.Mvc;
    using ModelRelief.Workbench;

    public class HomeController : Controller
        {
        private readonly IFunctionTwo<double> _function;

        public HomeController(IFunctionTwo<double> function)
        {
            this._function = function;
            Console.WriteLine(function.F2(1.0, 2.0));
        }

        public IActionResult Index()
            {
#if false
            // stackoverflow.com/questions/46406525/net-core-2-0-basepath-error
            return RedirectToAction("Edit", "Composer", new { Id = 1 });
#else
            return View();
#endif
            }
        }
    }
