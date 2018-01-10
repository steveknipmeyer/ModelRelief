// -----------------------------------------------------------------------
// <copyright file="GlobalExceptionFilter.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Errors
{
    using System.Net;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Filters;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Errors;

    /// <summary>
    /// A global exception handler.
    /// https://andrewlock.net/using-cancellationtokens-in-asp-net-core-mvc-controllers/
    /// </summary>
    public class GlobalExceptionFilter : ExceptionFilterAttribute
    {
        private readonly ILogger _logger;
        private readonly IHostingEnvironment _hostingEnvironment;

        /// <summary>
        /// Initializes a new instance of the <see cref="GlobalExceptionFilter"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="loggerFactory">Logger factory.</param>
        /// <param name="hostingEnvironment">IHostingEnvironment from DI.</param>
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

            if (context.Exception is UserAuthenticationException)
                statusCode = HttpStatusCode.Unauthorized;

            context.ExceptionHandled = true;
            context.Result = new StatusCodeResult((int)statusCode);
        }
    }
}