// -----------------------------------------------------------------------
// <copyright file="DepthBuffersController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.DepthBuffers
{
    using System.Threading.Tasks;
    using AutoMapper;
    using MediatR;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Features;
    using ModelRelief.Features.Settings;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents a controller to handle DepthBuffer Ux requests.
    /// </summary>
    public class DepthBuffersController : ViewController<Domain.DepthBuffer, Dto.DepthBuffer, Dto.DepthBuffer>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DepthBuffersController"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="settingsManager">Settings manager.</param>
        /// <param name="mediator">IMediator</param>
        /// <param name="query">IQuery</param>
        public DepthBuffersController(
                ModelReliefDbContext dbContext,
                ILoggerFactory loggerFactory,
                IMapper mapper,
                ISettingsManager settingsManager,
                IMediator mediator,
                IQuery query)
            : base(dbContext, loggerFactory, mapper, settingsManager, mediator, query)
        {
        }
        #region Get
        #endregion

        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="depthBuffer">DepthBuffer instance for View.</param>
        protected override async Task InitializeViewControlsAsync(Dto.DepthBuffer depthBuffer = null)
        {
            await InitializeSessionAsync();

            ViewBag.DepthBufferFormats  = PopulateEnumDropDownList<DepthBufferFormat>("Select depth buffer format");

            ViewBag.Model3dId = await PopulateModelDropDownList<Model3d, Dto.Model3d>(DbContext, UserId, SettingsManager.UserSession.ProjectId, "Select a model", depthBuffer?.Model3dId);
            ViewBag.CameraId  = await PopulateModelDropDownList<Camera, Dto.Camera>(DbContext, UserId, SettingsManager.UserSession.ProjectId, "Select a camera", depthBuffer?.CameraId);
        }
    }
}
