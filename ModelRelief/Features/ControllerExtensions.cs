// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ModelRelief.Features
{
    /// <summary>
    /// MVC Controller extensions.
    /// ContosoUniverityCore
    /// </summary>
    public static class ControllerExtensions
    {
        /// <summary>
        /// Controller extension that Redirects to a given action
        /// Returns a JSON content with the URL of the redirection.
        /// </summary>
        /// <typeparam name="TController">Controller</typeparam>
        /// <param name="controller">Instance of Controller</param>
        /// <param name="action">Redirect Action</param>
        /// <returns></returns>
        public static ActionResult RedirectToActionJson<TController>(this TController controller, string action)
            where TController : Controller
        {
            return controller.JsonContentResult(new
                {
                    redirect = controller.Url.Action(action)
                }
            );
        }

        /// <summary>
        /// Constructs a ContentResult JSON object.
        /// </summary>
        /// <param name="controller">Controller being extended</param>
        /// <param name="model">Model to serialize into JSON</param>
        /// <returns>ContentResult</returns>
        public static ContentResult JsonContentResult(this Controller controller, object model)
        {
            var serializedContent = JsonConvert.SerializeObject(model, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });

            return new ContentResult
            {
               ContentType = "application/json",
               Content     = serializedContent
            };
        }
    }
}