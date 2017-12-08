// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ModelRelief.Api.V1.Shared;
using ModelRelief.Database;
using ModelRelief.Domain;

namespace ModelRelief.Api.V1.DepthBuffers
{
    /// <summary>
    /// Represents a controller to handle DepthBuffer API requests.
    /// </summary>
    [Route ("api/v1/depth-buffers")]        
    public class DepthBuffersController : RestController<Domain.DepthBuffer, Dto.DepthBuffer, Dto.DepthBuffer, Dto.DepthBuffer, Dto.PostFile>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="userManager">UserManager to convert from ClaimsPrincipal to ApplicationUser.</param>
        /// <param name="logger">ILogger.</param>
        /// <param name="mediator">IMediator.</param>
        public DepthBuffersController(ModelReliefDbContext dbContext, UserManager<ApplicationUser> userManager, ILogger<Domain.DepthBuffer> logger, IMediator mediator)
            : base(dbContext, userManager, logger, mediator)
        {
        }
    }
}
 