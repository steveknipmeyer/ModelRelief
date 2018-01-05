﻿// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ModelRelief.Api.V1.Shared.Errors;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Database;
using ModelRelief.Domain;
using System;
using System.Net;
using System.Threading.Tasks;

namespace ModelRelief.Api.V1.Shared
{
//  WIP: What is the best practive for API authorization?
    [Authorize]
    [Area("ApiV1")]
    [Route("apiV1/[controller]")]
    [Produces("application/json")]
    public abstract class ApiController<TEntity> : Controller, IUrlHelperContainer
            where TEntity: DomainModel
    {
        public ModelReliefDbContext DbContext { get; }
        public UserManager<ApplicationUser> UserManager { get; }
        public ILogger<TEntity>     Logger { get; }
        public IMediator            Mediator { get; }

        /// <summary>
        /// Base API Controller
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="userManager">UserManager to convert from ClaimsPrincipal to ApplicationUser.</param>
        /// <param name="logger">ILogger.</param>
        /// <param name="mediator">IMediator.</param>
        protected ApiController (ModelReliefDbContext dbContext, UserManager<ApplicationUser> userManager, ILogger<TEntity> logger, IMediator mediator) 
        {
            DbContext   = dbContext;
            UserManager = userManager;
            Logger      = logger;
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