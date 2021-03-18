// -----------------------------------------------------------------------
// <copyright file="ModelsController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Models
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
    /// Represents a controller to handle Model Ux requests.
    /// </summary>
    public class ModelsController : ViewFileModelController<Domain.Model3d, Dto.Model3d, Dto.Model3d>
    {
        public Services.IConfigurationProvider ConfigurationProvider { get; }

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
        public ModelsController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMapper mapper, ISettingsManager settingsManager, IMediator mediator, Services.IConfigurationProvider configurationProvider)
            : base(dbContext, loggerFactory, mapper, settingsManager, mediator)
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
    }
}
