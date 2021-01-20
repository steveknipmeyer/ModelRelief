// -----------------------------------------------------------------------
// <copyright file="ValidatorActionFilter.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Infrastructure
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Filters;

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
            // This method fires after these validation checks have been applied to model-bound objects.
            //    IValidatableObject interface
            //    DataAnnotation attributes
            //    <T>Validator class implementing FluentValidation: AbstractValidator<T> (found by Mediator through reflection)

            if (filterContext.ModelState.IsValid)
                return;

            // skip api requests; a custom error is constructed in the API controller
            string areaValue = filterContext.RouteData.Values["area"] as string;
            if (!string.IsNullOrEmpty(areaValue) && areaValue.ToLower().StartsWith("api"))
                return;

            switch (filterContext.HttpContext.Request.Method)
            {
                // The model-binding validation failed on GET request such as Details.Query.
                // Example: The id parameter is null (e.g. meshes/details)
                case "GET":
                {
                    var result = new BadRequestResult();
                    filterContext.Result = result;
                    break;
                }

                // A request was received that "passed" the client-side validation BUT not the server-side validation.
                // Possible scenarios:
                //      Server-side rules failed that are not present (or supported) in the client. Some FluentValidation rules are not supported on the client.
                //          In a View, if the client-side validation fail, the request will not be submitted. But the client validation may not cover everything.
                //       A PUT/POST/DELETE request (intended for the API) was submitted to a non-API endpoint. So, the client-side rules were bypassed.
                // Options:
                //      Return an ActionResult with a View and the incoming model so the results can be displayed.
                //      (If it can be determined it was was a misdirected API request), send back application/json.
                default:
                {
#if true
                    filterContext.Result = new ViewResult();
#else
                    // This is the case where the request did not originate from a View - misdirected API request?
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
#endif
                    break;
                }
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
