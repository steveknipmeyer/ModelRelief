﻿// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

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
        /// ModelState has been constructed based on model IValidatableObject, FluentValidation.AbstractValidatorr and DataAnnotation validation.
        /// </summary>
        /// <param name="filterContext">Filter context.</param>
       public void OnActionExecuting(ActionExecutingContext filterContext)
        {
            // This method fires after these validation checks have been applied to nodel-bound objects.
            //    IValidatableObject interface
            //    DataAnnotation attributes
            //    <T>Validator class implementing FluentValidation: AbstractValidator<T> (found by Mediator through reflection)

            if (filterContext.ModelState.IsValid)
                return;

            // skip api requests; a custom error is constructed in the API controller
            string areaValue = filterContext.RouteData.Values["area"] as string;
            if (!String.IsNullOrEmpty(areaValue) && areaValue.ToLower().StartsWith("api"))
                return;

            if (filterContext.HttpContext.Request.Method == "GET")
            {
                var result = new BadRequestResult();
                filterContext.Result = result;
            }
            else
            {
                var result = new ContentResult();
                string content = JsonConvert.SerializeObject(filterContext.ModelState,
                    new JsonSerializerSettings
                    {
                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                    });
                result.Content = content;
                result.ContentType = "application/json";

                filterContext.HttpContext.Response.StatusCode = 400;
                filterContext.Result = result;
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
