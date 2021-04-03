// -----------------------------------------------------------------------
// <copyright file="UxController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features
{
    using System;
    using System.Threading.Tasks;
    using AutoMapper;
    using MediatR;
    using Microsoft.AspNetCore.Authentication.Cookies;
    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared;
    using ModelRelief.Api.V1.Shared.Errors;
    using ModelRelief.Database;
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme + "," + JwtBearerDefaults.AuthenticationScheme)]
    public abstract class UxController : Controller, IUrlHelperContainer
    {
        public ModelReliefDbContext         DbContext { get; }
        public ILogger                      Logger { get; }
        public IMapper                      Mapper { get; }
        public IMediator                    Mediator { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="UxController"/> class.
        /// Base UX Controller
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper from DI</param>
        /// <param name="mediator">IMediator from DI</param>
        protected UxController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMapper mapper, IMediator mediator)
        {
            DbContext   = dbContext;
            Logger      = loggerFactory.CreateLogger(typeof(UxController).Name);
            Mapper      = mapper;
            Mediator    = mediator;
        }

        /// <summary>
        /// Primary request handler
        /// </summary>
        /// <typeparam name="TReturn">Return type of request</typeparam>
        /// <param name="request">IRequest returning TReturn</param>
        protected async Task<object> HandleRequestAsync<TReturn>(IRequest<TReturn> request)
        {
            if (request == null)
                throw new NullRequestException(this.Request.Path, request.GetType());

            using (var transaction = DbContext.Database.BeginTransaction())
            {
                try
                {
                    // dispatch to registered handler
                    var response = await Mediator.Send(request);

                    transaction.Commit();
                    return response;
                }
                catch (RequestValidationException ex)
                {
                    foreach (var validationError in ex.ValidationException.Errors)
                    {
                        ModelState.AddModelError(validationError.PropertyName, validationError.ToString());
                    }

                    // controller Action method returns View(model) when result is null
                    DbContext.Database.RollbackTransaction();
                    return null;
                }
                catch (Exception ex) when (
                    ex is Exception ||
                    ex is EntityNotFoundException ||
                    ex is UserAuthenticationException)
                {
                    DbContext.Database.RollbackTransaction();
                    throw;
                }
            }
        }
    }
}