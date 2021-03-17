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
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Features;
    using ModelRelief.Features.Settings;

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
        public DepthBuffersController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMapper mapper, ISettingsManager settingsManager, IMediator mediator)
            : base(dbContext, loggerFactory, mapper, settingsManager, mediator)
        {
        }
        #region Get
        /// <summary>
        /// Action handler for an Index page.
        /// Returns a (filtered) collection of models.
        /// </summary>
        /// <param name="pagedQueryParameters">Parameters for returning a collection of models including page number, size.</param>
        /// <param name="queryParameters">Query parameters.</param>
        /// <returns>Index page.</returns>
        public override async Task<IActionResult> Index([FromQuery] GetPagedQueryParameters pagedQueryParameters, [FromQuery] GetQueryParameters queryParameters)
        {
            ViewResult view = await base.Index(pagedQueryParameters, queryParameters) as ViewResult;
            return await FilterViewByActiveProject<Dto.DepthBuffer>(view);
        }
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
