// -----------------------------------------------------------------------
// <copyright file="NormalMapsController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.NormalMaps
{
    using System.Threading.Tasks;
    using AutoMapper;
    using MediatR;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Features.Settings;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents a controller to handle NormalMap Ux requests.
    /// </summary>
    public class NormalMapsController : ViewController<Domain.NormalMap, Dto.NormalMap, Dto.NormalMap>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="NormalMapsController"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="settingsManager">Settings manager.</param>
        /// <param name="mediator">IMediator</param>
        /// <param name="query">IQuery</param>
        public NormalMapsController(
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
        /// <param name="normalMap">NormalMap instance for View.</param>
        protected override async Task InitializeViewControlsAsync(Dto.NormalMap normalMap = null)
        {
            await InitializeSessionAsync();

            ViewBag.NormalMapFormats  = PopulateEnumDropDownList<NormalMapFormat>("Select normal map format");
            ViewBag.NormalMapSpaces  = PopulateEnumDropDownList<NormalMapSpace>("Select normal map space");

            ViewBag.Model3dId = await PopulateModelDropDownList<Model3d, Dto.Model3d>(DbContext, UserId, SettingsManager.UserSession.ProjectId, "Select a model", normalMap?.Model3dId);
            ViewBag.CameraId  = await PopulateModelDropDownList<Camera, Dto.Camera>(DbContext, UserId, SettingsManager.UserSession.ProjectId, "Select a camera", normalMap?.CameraId);
        }
    }
}
