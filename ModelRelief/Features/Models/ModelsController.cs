// -----------------------------------------------------------------------
// <copyright file="ModelsController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Models
{
    using System.Security.Claims;
    using System.Threading.Tasks;
    using AutoMapper;
    using MediatR;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Models;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Features;
    using ModelRelief.Features.Settings;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents a controller to handle Model Ux requests.
    /// </summary>
    public class ModelsController : ViewFileModelController<Domain.Model3d, Dto.Model3d, Dto.Model3d>
    {
        protected Services.IConfigurationProvider ConfigurationProvider { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ModelsController"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="settingsManager">Settings manager.</param>
        /// <param name="mediator">IMediator</param>
        /// <param name="configurationProvider">Configuration provider.</param>
        /// <param name="dbFactory">IDbFactory</param>
        /// <param name="query">IQuery</param>
        public ModelsController(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            ISettingsManager settingsManager,
            IMediator mediator,
            Services.IConfigurationProvider configurationProvider,
            IDbFactory dbFactory,
            IQuery query)
            : base(dbContext, loggerFactory, mapper, settingsManager, mediator, dbFactory, query)
        {
            ConfigurationProvider = configurationProvider;
        }

        #region Get
        #endregion

        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="model">Model instance for View.</param>
        protected override async Task InitializeViewControlsAsync(Dto.Model3d model)
        {
            await InitializeSessionAsync();

            ViewBag.ModelFormat  = PopulateEnumDropDownList<Model3dFormat>("Select model format");

            ViewBag.CameraId     = await PopulateModelDropDownList<Camera, Dto.Camera>(DbContext, UserId, SettingsManager.UserSession.ProjectId, "Select a camera", model?.CameraId);
        }

        /// <summary>
        /// Post process a Create request.
        /// </summary>
        /// <param name="user">Active user</param>
        /// <param name="newModel">New model to post-processs.</param>
        protected override async Task<Dto.Model3d> PostProcessCreate(ClaimsPrincipal user, Dto.Model3d newModel)
        {
            var model3d = await Query.FindDomainModelAsync<Model3d>(User, newModel.Id);

            // contents validated upstream; assign format now
            model3d.Format = ModelPostFileRequestValidator.MapFormatFromExtension(newModel.Name);

            var applicationUser = await IdentityUtility.FindApplicationUserAsync(User);
            model3d = DbFactory.AddModel3dRelated(applicationUser, model3d);
            if (model3d == null)
            {
                ModelState.AddModelError(nameof(PostProcessCreate), $"An error happened while adding the related resources for {newModel.Name}.");
                return null;
            }

            return Mapper.Map<Model3d, Dto.Model3d>(model3d);
        }
    }
}
