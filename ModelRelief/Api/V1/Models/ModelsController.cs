// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ModelRelief.Api.V1.Shared;
using ModelRelief.Database;
using ModelRelief.Domain;

namespace ModelRelief.Api.V1.Models
{
    /// <summary>
    /// Represents a controller to handle Model3d API requests.
    /// </summary>
    [Route ("api/v1/[controller]")]        
    public class ModelsController : RestController<Domain.Model3d, Dto.Model3d, Dto.Model3d, Dto.Model3d, Dto.PostFile>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="userManager">UserManager to convert from ClaimsPrincipal to ApplicationUser.</param>
        /// <param name="logger">ILogger.</param>
        /// <param name="mediator">IMediator.</param>
        public ModelsController(ModelReliefDbContext dbContext, UserManager<ApplicationUser> userManager, ILogger<Domain.Model3d> logger, IMediator mediator)
            : base(dbContext, userManager, logger, mediator)
        {
        }
    }
}
 