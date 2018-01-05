// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Utility;
using System.Threading.Tasks;

namespace ModelRelief.Features.Projects
{
    /// <summary>
    /// Represents a controller to handle Project Ux requests.
    /// </summary>
    [Authorize]
    public class ProjectsController : ViewController<Domain.Project, Dto.Project, Dto.Project, Dto.Project>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="userManager">UserManager (ClaimsPrincipal -> ApplicationUser).</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        public ProjectsController(ModelReliefDbContext dbContext, UserManager<ApplicationUser> userManager, ILoggerFactory loggerFactory, IMapper mapper, IMediator mediator)
            : base(dbContext, userManager, loggerFactory, mapper, mediator)
        {
        }
        
        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="project">Project instance for View.</param>
        protected async override Task InitializeViewControls(Dto.Project project = null)
        {
            var applicationUser = await Identity.FindApplicationUserAsync(UserManager, User);
            var userId = applicationUser?.Id ?? "";
        }
    }
}
