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
using ModelRelief.Database;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Api.V2.Shared
{
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
                var error = new ErrorResponse
                {
                    Error = new Error
                    {
                        Message = "A bad request was received.",
                        Details = new[] { 
                            new ErrorDetail
                            {
                                Message = "The body of the request contained no usable content."
                            }
                        }
                    }
                };
                return BadRequest(error);
            }
            
            try
            {
                // dispatch to registered handler
                var response = await Mediator.Send(request);

                return Ok(response);
            }
            catch (ValidationException ex)
            {
                var error = new ErrorResponse
                {
                    Error = new Error
                    {
                        Message = "A bad request was received.",
                        Details = ex.Errors.Select(e => new ErrorDetail
                        {
                            Message = e.ErrorMessage,
                            Target  = e.PropertyName
                        }).ToArray()
                    }
                };
                return BadRequest(error);
            }
            catch (EntityNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}