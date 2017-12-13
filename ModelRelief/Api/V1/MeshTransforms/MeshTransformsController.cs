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

namespace ModelRelief.Api.V1.MeshTransforms
{
    /// <summary>
    /// Represents a controller to handle MeshTransform API requests.
    /// </summary>
    [Route ("api/v1/[controller]")]        
    public class MeshTransformsController : RestController<Domain.MeshTransform, Dto.MeshTransform, Dto.MeshTransform, Dto.MeshTransform, Dto.PostFile>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="userManager">UserManager to convert from ClaimsPrincipal to ApplicationUser.</param>
        /// <param name="logger">ILogger.</param>
        /// <param name="mediator">IMediator.</param>
        public MeshTransformsController(ModelReliefDbContext dbContext, UserManager<ApplicationUser> userManager, ILogger<Domain.MeshTransform> logger, IMediator mediator)
            : base(dbContext, userManager, logger, mediator)
        {
        }
    }
}
 