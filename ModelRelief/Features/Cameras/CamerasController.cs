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
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Features.Settings;

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
        protected async override Task InitializeViewControlsAsync(Dto.Camera camera = null)
        {
            await InitializeSessionAsync();
            ViewBag.StandardViews = PopulateEnumDropDownList<StandardView>("Select a standard camera view");
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
            return await FilterViewByActiveProject<Dto.Camera>(view);
        }
        #endregion
    }
}
