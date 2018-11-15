// -----------------------------------------------------------------------
// <copyright file="ApiController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared
{
    using System;
    using System.Net;
    using System.Threading.Tasks;
    using MediatR;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Errors;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Domain;

    // WIP: What is the best practive for API authorization?
    [Authorize]
    [Area("ApiV1")]
    [Route("apiV1/[controller]")]
    [Produces("application/json")]
    public abstract class ApiController<TEntity> : Controller, IUrlHelperContainer
            where TEntity : DomainModel
    {
        public ModelReliefDbContext             DbContext { get; }
        public ILogger                          Logger { get; }
        public IMediator                        Mediator { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ApiController{TEntity}"/> class.
        /// Base API Controller
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mediator">IMediator.</param>
        protected ApiController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMediator mediator)
        {
            DbContext   = dbContext;
            Logger      = loggerFactory.CreateLogger(typeof(ApiController<TEntity>).Name);
            Mediator    = mediator;
        }

        /// <summary>
        /// Primary request handler
        /// </summary>
        /// <typeparam name="TReturn">Return type of request</typeparam>
        /// <param name="request">IRequest returning TReturn</param>
        /// <returns>IActionResult (to be converted to application/json)</returns>
        protected async Task<IActionResult> HandleRequestAsync<TReturn>(IRequest<TReturn> request)
        {
            if (request == null)
            {
                var apiValidationResult = new ApiErrorResult(
                    this,
                    HttpStatusCode.BadRequest,
                    ApiErrorCode.NullRequest,
                    "The body of the request contained no usable content.");

                return apiValidationResult.ObjectResult();
            }

            try
            {
                // dispatch to registered handler
                var response = await Mediator.Send(request);

                return Ok(response);
            }
            catch (ApiValidationException ex)
            {
                var typeArguments = ex.RequestType.GenericTypeArguments;

                var apiValidationResult = new ApiErrorResult(
                    this,
                    HttpStatusCode.BadRequest,
                    ApiValidationHelper.MapRequestToApiErrorCode(this.Request, ex.RequestType),
                    $"One or more of the properties are invalid in the submitted request: {ex.RequestType}.");

                return apiValidationResult.ObjectResult(ex.ValidationException.Errors);
            }
            catch (EntityNotFoundException ex)
            {
                var apiValidationResult = new ApiErrorResult(
                    this,
                    HttpStatusCode.NotFound,
                    ApiErrorCode.NotFound,
                    ex.Message);

                return apiValidationResult.ObjectResult();
            }
            catch (ModelFileNotFoundException ex)
            {
                var apiValidationResult = new ApiErrorResult(
                    this,
                    HttpStatusCode.NotFound,
                    ApiErrorCode.NotFound,
                    ex.Message);

                return apiValidationResult.ObjectResult();
            }
            catch (ModelNotBackedByFileException ex)
            {
                var apiValidationResult = new ApiErrorResult(
                    this,
                    HttpStatusCode.NotFound,
                    ApiErrorCode.NoBackingFile,
                    ex.Message);

                return apiValidationResult.ObjectResult();
            }
            catch (UserAuthenticationException ex)
            {
                var apiValidationResult = new ApiErrorResult(
                    this,
                    HttpStatusCode.Unauthorized,
                    ApiErrorCode.Unauthorized,
                    ex.Message);

                return apiValidationResult.ObjectResult();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}