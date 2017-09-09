// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using Microsoft.AspNetCore.Mvc;

using ModelRelief.Entitities;
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
            return View ();
            }
        }
    }
