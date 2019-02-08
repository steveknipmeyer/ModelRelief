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

        /// <summary>
        /// Action method for Home page.
        /// </summary>
        public IActionResult Index()
            {
            return View();
            }

        /// <summary>
        /// Action method for Privacy Get.
        /// </summary>
        [HttpGet]
        public IActionResult Privacy()
        {
            return View();
        }
    }
}
