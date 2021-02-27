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
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents a controller to handle Model Ux requests.
    /// </summary>
    [Authorize]
    public class ModelsController : ViewController<Domain.Model3d, Dto.Model3d, Dto.Model3d>
    {
        public Services.IConfigurationProvider ConfigurationProvider { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ModelsController"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        /// <param name="configurationProvider">Configuration provider.</param>
        public ModelsController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMapper mapper, IMediator mediator, Services.IConfigurationProvider configurationProvider)
            : base(dbContext, loggerFactory, mapper, mediator)
        {
            ConfigurationProvider = configurationProvider;
        }

        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="model">Model instance for View.</param>
        protected async override Task InitializeViewControls(Dto.Model3d model)
        {
            var applicationUser = await IdentityUtility.FindApplicationUserAsync(User);
            var userId = applicationUser?.Id ?? string.Empty;

            ViewBag.ModelFormat  = ViewHelpers.PopulateEnumDropDownList<Model3dFormat>("Select model format");

            ViewBag.ProjectId    = ViewHelpers.PopulateModelDropDownList<Project>(DbContext, userId, "Select a project", model?.ProjectId);
            ViewBag.CameraId     = ViewHelpers.PopulateModelDropDownList<Camera>(DbContext, userId, "Select a camera", model?.CameraId);
        }
    }
}
