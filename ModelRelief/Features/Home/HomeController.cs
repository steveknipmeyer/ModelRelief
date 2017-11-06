// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Mvc;

namespace ModelRelief.Features.Home
{
    public class HomeController : Controller
        {
        public HomeController()
            {
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
