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
    using Microsoft.Extensions.Logging;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Features.Settings;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents a controller to handle Camera Ux requests.
    /// </summary>
    public class CamerasController : ViewController<Domain.Camera, Dto.Camera, Dto.Camera>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CamerasController"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="settingsManager">Settings manager.</param>
        /// <param name="mediator">IMediator</param>
        public CamerasController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMapper mapper, ISettingsManager settingsManager, IMediator mediator)
            : base(dbContext, loggerFactory, mapper, settingsManager, mediator)
        {
        }

        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="camera">Camera instance for View.</param>
        protected async override Task InitializeViewControls(Dto.Camera camera = null)
        {
            var applicationUser = await IdentityUtility.FindApplicationUserAsync(User);
            var userId = applicationUser?.Id ?? string.Empty;

            ViewBag.StandardViews   = ViewHelpers.PopulateEnumDropDownList<StandardView>("Select a standard camera view");
        }
    }
}
