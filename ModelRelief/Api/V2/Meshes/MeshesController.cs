// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ModelRelief.Api.V2.Shared;
using ModelRelief.Database;
using ModelRelief.Domain;

namespace ModelRelief.Api.V2.Meshes
{
    /// <summary>
    /// Represents a controller to handle Mesh API requests.
    /// </summary>
    // WIP How are API controllers authorized?
    // [Authorize]
    [Route ("api/v2/[controller]")]        
    public class MeshesController : RestController<Domain.Mesh, Dto.Mesh, Dto.Mesh, Dto.Mesh, Dto.PostFile>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="logger">ILogger.</param>
        /// <param name="mapper">IMapper.</param>
        /// <param name="mediator">IMediator.</param>
        /// <param name="userManager">UserManager.</param>
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        public MeshesController(ModelReliefDbContext dbContext, ILogger<Domain.Mesh> logger, IMapper mapper, IMediator mediator, UserManager<ApplicationUser> userManager, IHostingEnvironment hostingEnvironment, Services.IConfigurationProvider  configurationProvider)
            : base(dbContext, logger, mapper, mediator, userManager, hostingEnvironment, configurationProvider)
        {
        }
    }
}
 