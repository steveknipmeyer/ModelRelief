// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace ModelRelief.Features.Errors
{
    public class Errors : Controller
    {
        /// <summary>
        /// Error page for a middleware HTTP status code such as 404.
        /// </summary>
        /// <remarks>This is used for middleware errors such as no endpoint NotFound (404). 
        /// It is NOT used for an error code returned by the application such as BadRequest (400)</remarks>
        /// <param name="id"></param>
        /// <returns></returns>
        public IActionResult Error (int id)
        {
            string page = "Error";
            switch (id)
            {
                case (int) HttpStatusCode.BadRequest:
                    page = "BadRequest";
                    break;

                case (int) HttpStatusCode.NotFound:
                    page = "NotFound";
                    break;
            }
            ViewData["statusCode"] = id;
            return View(page);
        }

    }
}
