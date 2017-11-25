// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Api.V2.Shared;
using ModelRelief.Api.V2.Shared.Errors;
using ModelRelief.Database;
using System;
using System.Threading.Tasks;

namespace ModelRelief.Features
{
    public abstract class UxController : Controller, IUrlHelperContainer
    {
        public ModelReliefDbContext DbContext { get; }
        public IMapper Mapper { get; }
        public IMediator Mediator { get; }

        /// <summary>
        /// Base UX Controller
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper from DI</param>
        /// <param name="mediator">IMediator from DI</param>
        protected UxController(ModelReliefDbContext dbContext, IMapper mapper, IMediator mediator) {
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
        protected async Task<object> HandleRequestAsync<TReturn>(IRequest<TReturn> request)
        {
            if (request == null)
                throw new NullRequestException(this.Request.Path, request.GetType());
            
            try
            {
                // dispatch to registered handler
                var response = await Mediator.Send(request);
                return response;
            }
            catch (ValidationException)
            {
                // action method returns View(model) when result is null
                return null;
            }
            catch (EntityNotFoundException)
            {
                throw;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}