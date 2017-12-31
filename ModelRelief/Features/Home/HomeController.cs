// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Workbench;
using System;

namespace ModelRelief.Features.Home
{
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
            return RedirectToAction ("Viewer", "Models", new { Id = 1});           
#else
            return View ();
#endif
            }
        }
    }
