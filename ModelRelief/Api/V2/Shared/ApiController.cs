// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Api.V2.Shared.Errors;
using ModelRelief.Api.V2.Shared.Rest;
using ModelRelief.Database;
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace ModelRelief.Api.V2.Shared
{
    [Area("ApiV2")]
    [Route("apiV2/[controller]")]
    [Produces("application/json")]
    public abstract class ApiController : Controller, IUrlHelperContainer
    {
        public ModelReliefDbContext DbContext { get; }
        public IMapper Mapper { get; }
        public IMediator Mediator { get; }

        /// <summary>
        /// Base API Controller
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper from DI</param>
        /// <param name="mediator">IMediator from DI</param>
        protected ApiController(ModelReliefDbContext dbContext, IMapper mapper, IMediator mediator) {
            DbContext = dbContext;
            Mapper = mapper;
            Mediator = mediator;
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
                var apiValidationResult = new ApiValidationResult(
                    this, 
                    HttpStatusCode.BadRequest, 
                    ApiStatusCode.NullRequest, 
                    "The body of the request contained no usable content.");

                return apiValidationResult.ObjectResult();
            }
            
            try
            {
                // dispatch to registered handler
                var response = await Mediator.Send(request);

                return Ok(response);
            }
            catch (ValidationException)
            {
                // WIP: Create a helper method to map a validation error into a specific ApiStatusCode(Model, Request).
                var apiValidationResult = new ApiValidationResult(
                    this, 
                    HttpStatusCode.BadRequest, 
                    ApiStatusCode.Default, 
                    "One or more of the properties are invalid in the submitted request.");

                return apiValidationResult.ObjectResult();
            }
            catch (EntityNotFoundException ex)
            {
                var apiValidationResult = new ApiValidationResult(
                    this, 
                    HttpStatusCode.NotFound, 
                    ApiStatusCode.NotFound, 
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