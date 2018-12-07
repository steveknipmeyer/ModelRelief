// -----------------------------------------------------------------------
// <copyright file="MeshesController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Meshes
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
    /// Represents a controller to handle Mesh Ux requests.
    /// </summary>
    [Authorize]
    public class MeshesController : ViewController<Domain.Mesh, Dto.Mesh, Dto.Mesh, Dto.Mesh>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MeshesController"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        public MeshesController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMapper mapper, IMediator mediator)
            : base(dbContext, loggerFactory, mapper, mediator)
        {
        }

        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="mesh">Mesh instance for View.</param>
        protected async override Task InitializeViewControls(Dto.Mesh mesh = null)
        {
            var applicationUser = await IdentityUtility.FindApplicationUserAsync(User);
            var userId = applicationUser?.Id ?? string.Empty;

            ViewBag.MeshFormat      = ViewHelpers.PopulateEnumDropDownList<MeshFormat>("Select mesh format");

            ViewBag.ProjectId       = ViewHelpers.PopulateModelDropDownList<Project>(DbContext, userId, "Select a project", mesh?.ProjectId);
            ViewBag.CameraId        = ViewHelpers.PopulateModelDropDownList<Camera>(DbContext, userId, "Select a camera", mesh?.CameraId);
            ViewBag.DepthBufferId   = ViewHelpers.PopulateModelDropDownList<DepthBuffer>(DbContext, userId, "Select a depth buffer", mesh?.DepthBufferId);
            ViewBag.NormalMapId      = ViewHelpers.PopulateModelDropDownList<NormalMap>(DbContext, userId, "Select a normal map", mesh?.NormalMapId);
            ViewBag.MeshTransformId = ViewHelpers.PopulateModelDropDownList<MeshTransform>(DbContext, userId, "Select a mesh transform", mesh?.CameraId);
        }
    }
}
