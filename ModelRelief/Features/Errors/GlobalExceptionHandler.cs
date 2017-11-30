// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using ModelRelief.Api.V2.Shared.Errors;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace ModelRelief.Features.Errors
{
    /// <summary>
    /// A global exception handler.
    /// https://andrewlock.net/using-cancellationtokens-in-asp-net-core-mvc-controllers/
    /// </summary>
    public class GlobalExceptionFilter : ExceptionFilterAttribute  
    {
        private readonly ILogger _logger;
        private readonly IHostingEnvironment _hostingEnvironment;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="loggerFactory">Logger factory</param>
        public GlobalExceptionFilter(ILoggerFactory loggerFactory, IHostingEnvironment hostingEnvironment)
        {
            _logger = loggerFactory.CreateLogger<GlobalExceptionFilter>();
            _hostingEnvironment = hostingEnvironment;
        }

        /// <summary>
        /// Exception handler.
        /// </summary>
        /// <param name="context">Exception context.</param>
        public override void OnException(ExceptionContext context)
        {
            if (_hostingEnvironment.IsDevelopment())
                return;

            _logger.LogInformation($"A {context.Exception.GetType().FullName} exception happened in ModelRelief.");
            var statusCode = HttpStatusCode.BadRequest;

            // WIP: Can a custom status code be used to provide+ fine-grained control over the page type that will be displayed?
            if (context.Exception is NullRequestException)
                statusCode = HttpStatusCode.BadRequest;

            if (context.Exception is EntityNotFoundException)
                statusCode = HttpStatusCode.NotFound;

            context.ExceptionHandled = true;
            context.Result = new StatusCodeResult((int) statusCode);
        }
    }
}