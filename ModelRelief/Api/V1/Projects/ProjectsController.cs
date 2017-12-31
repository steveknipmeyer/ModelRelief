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

namespace ModelRelief.Api.V1.Projects
{
    /// <summary>
    /// Represents a controller to handle Project API requests.
    /// </summary>
    [Route ("api/v1/[controller]")]        
    public class ProjectsController : RestController<Domain.Project, Dto.Project, Dto.Project, Dto.Project, Dto.Project>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="userManager">UserManager to convert from ClaimsPrincipal to ApplicationUser.</param>
        /// <param name="logger">ILogger.</param>
        /// <param name="mediator">IMediator.</param>
        public ProjectsController(ModelReliefDbContext dbContext, UserManager<ApplicationUser> userManager, ILogger<Domain.Project> logger, IMediator mediator)
            : base(dbContext, userManager, logger, mediator)
        {
        }
    }
}
 