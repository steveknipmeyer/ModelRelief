// -----------------------------------------------------------------------
// <copyright file="MeshesController.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Meshes
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
    using ModelRelief.Utility;

    /// <summary>
    /// Represents a controller to handle Mesh Ux requests.
    /// </summary>
    public class MeshesController : ViewFileModelController<Domain.Mesh, Dto.Mesh, Dto.Mesh>
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
        /// <param name="query">IQuery</param>
        public MeshesController(
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
        #endregion

        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="mesh">Mesh instance for View.</param>
        protected override async Task InitializeViewControlsAsync(Dto.Mesh mesh = null)
        {
            await InitializeSessionAsync();

            ViewBag.MeshFormat       = PopulateEnumDropDownList<MeshFormat>("Select mesh format");

            ViewBag.CameraId         = await PopulateModelDropDownList<Camera, Dto.Camera>(DbContext, UserId, SettingsManager.UserSession.ProjectId, "Select a camera", mesh?.CameraId);
            ViewBag.DepthBufferId    = await PopulateModelDropDownList<DepthBuffer, Dto.DepthBuffer>(DbContext, UserId, SettingsManager.UserSession.ProjectId, "Select a depth buffer", mesh?.DepthBufferId);
            ViewBag.NormalMapId      = await PopulateModelDropDownList<NormalMap, Dto.NormalMap>(DbContext, UserId, SettingsManager.UserSession.ProjectId, "Select a normal map", mesh?.NormalMapId);
            ViewBag.MeshTransformId  = await PopulateModelDropDownList<MeshTransform, Dto.MeshTransform>(DbContext, UserId, SettingsManager.UserSession.ProjectId, "Select a mesh transform", mesh?.CameraId);
        }
    }
}
