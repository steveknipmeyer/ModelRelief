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
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents a controller to handle DepthBuffer Ux requests.
    /// </summary>
    [Authorize]
    public class DepthBuffersController : ViewController<Domain.DepthBuffer, Dto.DepthBuffer, Dto.DepthBuffer, Dto.DepthBuffer>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DepthBuffersController"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        public DepthBuffersController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMapper mapper, IMediator mediator)
            : base(dbContext, loggerFactory, mapper, mediator)
        {
        }

        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="depthBuffer">DepthBuffer instance for View.</param>
        protected async override Task InitializeViewControls(Dto.DepthBuffer depthBuffer = null)
        {
            var applicationUser = await IdentityUtility.FindApplicationUserAsync(User);
            var userId = applicationUser?.Id ?? string.Empty;

            ViewBag.DepthBufferFormats  = ViewHelpers.PopulateEnumDropDownList<DepthBufferFormat>("Select depth buffer format");

            ViewBag.ProjectId = ViewHelpers.PopulateModelDropDownList<Project>(DbContext, userId, "Select a project", depthBuffer?.ProjectId);
            ViewBag.Model3dId = ViewHelpers.PopulateModelDropDownList<Model3d>(DbContext, userId, "Select a model", depthBuffer?.Model3dId);
            ViewBag.CameraId  = ViewHelpers.PopulateModelDropDownList<Camera>(DbContext, userId, "Select a camera", depthBuffer?.CameraId);
        }
    }
}
