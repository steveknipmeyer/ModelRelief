// -----------------------------------------------------------------------
// <copyright file="DepthBuffersController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.DepthBuffers
{
    using MediatR;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared;
    using ModelRelief.Database;
    using ModelRelief.Domain;

    /// <summary>
    /// Represents a controller to handle DepthBuffer API requests.
    /// </summary>
    [Route("api/v1/depth-buffers")]
    public class DepthBuffersController : RestController<Domain.DepthBuffer, Dto.DepthBuffer, Dto.DepthBuffer, Dto.DepthBuffer, Dto.PostFile>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DepthBuffersController"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="userManager">UserManager to convert from ClaimsPrincipal to ApplicationUser.</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mediator">IMediator.</param>
        public DepthBuffersController(ModelReliefDbContext dbContext, UserManager<ApplicationUser> userManager, ILoggerFactory loggerFactory, IMediator mediator)
            : base(dbContext, userManager, loggerFactory, mediator)
        {
        }
    }
}
