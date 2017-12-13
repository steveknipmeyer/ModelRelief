// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ModelRelief.Api.V1.Shared;
using ModelRelief.Database;
using ModelRelief.Domain;

namespace ModelRelief.Api.V1.Cameras
{
    /// <summary>
    /// Represents a controller to handle Camera API requests.
    /// </summary>
    [Route ("api/v1/[controller]")]        
    public class CamerasController : RestController<Domain.Camera, Dto.Camera, Dto.Camera, Dto.Camera, Dto.PostFile>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="userManager">UserManager to convert from ClaimsPrincipal to ApplicationUser.</param>
        /// <param name="logger">ILogger.</param>
        /// <param name="mediator">IMediator.</param>
        public CamerasController(ModelReliefDbContext dbContext, UserManager<ApplicationUser> userManager, ILogger<Domain.Camera> logger, IMediator mediator)
            : base(dbContext, userManager, logger, mediator)
        {
        }
    }
}
 