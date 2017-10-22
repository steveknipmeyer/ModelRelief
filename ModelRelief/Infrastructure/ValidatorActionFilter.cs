// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

using Serilog;
using Serilog.Events;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

using ModelRelief.Database;
using ModelRelief.Models;
using System.Net;

namespace ModelRelief.Infrastructure
{
    /// <summary>
    /// Action filter for processing all action methods.
    /// </summary>
    public class ValidatorActionFilter : IActionFilter
    {
        /// <summary>
        /// Pre-process action method. 
        /// Called before request reaches controller method.
        /// ModelState has been constructed based on model IValidatorObject validation.
        /// </summary>
        /// <param name="filterContext">Filter context.</param>
        public void OnActionExecuting(ActionExecutingContext filterContext)
        {
            // filter only api requests
            string areaValue = filterContext.RouteData.Values["area"] as string;
            if (!String.Equals(areaValue, "api", StringComparison.InvariantCultureIgnoreCase))
                return;
            
            if (filterContext.ModelState.IsValid)
                return;
            
            switch (filterContext.HttpContext.Request.Method)
            {
                case "GET":
                    {
                    var result = new BadRequestResult();
                    filterContext.Result = result;
                    break;
                    }

                case "POST":
                case "PUT":
                    {
                    var result = new BadRequestResult();
                    filterContext.Result = result;
                    }
                    break;

                default:
                    break;
            }
        }

        /// <summary>
        /// Post-process action method.
        /// </summary>
        /// <param name="filterContext">Filter context</param>
        public void OnActionExecuted(ActionExecutedContext filterContext)
        {
        }
    }
}
