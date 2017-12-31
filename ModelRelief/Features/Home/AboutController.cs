// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Mvc;

namespace ModelRelief.Features.Home
{
    public class AboutController : Controller
        {
        public IActionResult Phone()
            {
            return Content("571 730 7138");
            }

        [Route ("special/{id?}")]
        public IActionResult Company()
            {
            return Content("ModelRelief, LLC");
            }
        }
    }
