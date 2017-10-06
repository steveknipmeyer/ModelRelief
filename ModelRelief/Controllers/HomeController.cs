// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using Microsoft.AspNetCore.Mvc;

using ModelRelief.Entities;
using ModelRelief.Services;

namespace ModelRelief.Controllers
    {
    public class HomeController : Controller
        {
        public HomeController()
            {
            }

        public IActionResult Index()
            {           
#if true
            // stackoverflow.com/questions/46406525/net-core-2-0-basepath-error
            return RedirectToAction ("Viewer", "Models", new { Id = 1});           
#else
            return View ();
#endif
            }
        }
    }
