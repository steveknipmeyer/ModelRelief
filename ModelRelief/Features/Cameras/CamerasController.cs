// -----------------------------------------------------------------------
// <copyright file="CamerasController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Cameras
{
    using System.Threading.Tasks;
    using AutoMapper;
    using MediatR;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents a controller to handle Camera Ux requests.
    /// </summary>
    [Authorize]
    public class CamerasController : ViewController<Domain.Camera, Dto.Camera, Dto.Camera, Dto.Camera>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CamerasController"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="userManager">UserManager (ClaimsPrincipal -> ApplicationUser).</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        public CamerasController(ModelReliefDbContext dbContext, UserManager<ApplicationUser> userManager, ILoggerFactory loggerFactory, IMapper mapper, IMediator mediator)
            : base(dbContext, userManager, loggerFactory, mapper, mediator)
        {
        }

        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="camera">Camera instance for View.</param>
        protected async override Task InitializeViewControls(Dto.Camera camera = null)
        {
            var applicationUser = await Identity.FindApplicationUserAsync(UserManager, User);
            var userId = applicationUser?.Id ?? string.Empty;

            ViewBag.StandardViews   = ViewHelpers.PopulateEnumDropDownList<StandardView>("Select a standard camera view");
            ViewBag.ProjectId       = ViewHelpers.PopulateModelDropDownList<Project>(DbContext, userId, "Select a project", camera?.ProjectId);
        }
    }
}
