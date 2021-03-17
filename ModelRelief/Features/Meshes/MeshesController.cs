﻿// -----------------------------------------------------------------------
// <copyright file="MeshesController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Meshes
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;
    using AutoMapper;
    using MediatR;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Features.Settings;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents a controller to handle Mesh Ux requests.
    /// </summary>
    public class MeshesController : ViewController<Domain.Mesh, Dto.Mesh, Dto.Mesh>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MeshesController"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="settingsManager">Settings manager.</param>
        /// <param name="mediator">IMediator</param>
        public MeshesController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMapper mapper, ISettingsManager settingsManager, IMediator mediator)
            : base(dbContext, loggerFactory, mapper, settingsManager, mediator)
        {
        }

        /// <summary>
        /// Action handler for a Compose request.
        /// </summary>
        /// <param name="id">Mesh Id.</param>
        /// <param name="queryParameters">Query parameters.</param>
        /// <returns>Compose page.</returns>
        public async Task<IActionResult> Compose(int id, [FromQuery] GetQueryParameters queryParameters)
        {
            var result = await Edit(id, queryParameters);
            if (result is NotFoundResult)
                return result;

            // return Compose View
            var editView = result as ViewResult;
            return View(editView.Model);
        }

        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="mesh">Mesh instance for View.</param>
        protected override async Task InitializeViewControlsAsync(Dto.Mesh mesh = null)
        {
            await InitializeSessionAsync();

            ViewBag.MeshFormat       = PopulateEnumDropDownList<MeshFormat>("Select mesh format");

            ViewBag.CameraId         = await PopulateModelDropDownList<Dto.Camera>(DbContext, UserId, SettingsManager.UserSession.ProjectId, "Select a camera", mesh?.CameraId);
            ViewBag.DepthBufferId    = await PopulateModelDropDownList<Dto.DepthBuffer>(DbContext, UserId, SettingsManager.UserSession.ProjectId, "Select a depth buffer", mesh?.DepthBufferId);
            ViewBag.NormalMapId      = await PopulateModelDropDownList<Dto.NormalMap>(DbContext, UserId, SettingsManager.UserSession.ProjectId, "Select a normal map", mesh?.NormalMapId);
            ViewBag.MeshTransformId  = await PopulateModelDropDownList<Dto.MeshTransform>(DbContext, UserId, SettingsManager.UserSession.ProjectId, "Select a mesh transform", mesh?.CameraId);
        }

        #region Get
        /// <summary>
        /// Action handler for an Index page.
        /// Returns a collection of models.
        /// </summary>
        /// <param name="pagedQueryParameters">Parameters for returning a collection of models including page number, size.</param>
        /// <param name="queryParameters">Query parameters.</param>
        /// <returns>Index page.</returns>
        public override async Task<IActionResult> Index([FromQuery] GetPagedQueryParameters pagedQueryParameters, [FromQuery] GetQueryParameters queryParameters)
        {
            ViewResult view = await base.Index(pagedQueryParameters, queryParameters) as ViewResult;
            return await FilterViewByActiveProject<Dto.Mesh>(view);
        }
        #endregion
    }
}
