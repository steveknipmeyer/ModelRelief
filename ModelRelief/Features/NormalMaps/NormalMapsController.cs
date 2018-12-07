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
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents a controller to handle NormalMap Ux requests.
    /// </summary>
    [Authorize]
    public class NormalMapsController : ViewController<Domain.NormalMap, Dto.NormalMap, Dto.NormalMap, Dto.NormalMap>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="NormalMapsController"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        public NormalMapsController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMapper mapper, IMediator mediator)
            : base(dbContext, loggerFactory, mapper, mediator)
        {
        }

        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="normalMap">NormalMap instance for View.</param>
        protected async override Task InitializeViewControls(Dto.NormalMap normalMap = null)
        {
            var applicationUser = await IdentityUtility.FindApplicationUserAsync(User);
            var userId = applicationUser?.Id ?? string.Empty;

            ViewBag.NormalMapFormats  = ViewHelpers.PopulateEnumDropDownList<NormalMapFormat>("Select normal map format");
            ViewBag.NormalMapSpaces  = ViewHelpers.PopulateEnumDropDownList<NormalMapSpace>("Select normal map space");

            ViewBag.ProjectId = ViewHelpers.PopulateModelDropDownList<Project>(DbContext, userId, "Select a project", normalMap?.ProjectId);
            ViewBag.Model3dId = ViewHelpers.PopulateModelDropDownList<Model3d>(DbContext, userId, "Select a model", normalMap?.Model3dId);
            ViewBag.CameraId  = ViewHelpers.PopulateModelDropDownList<Camera>(DbContext, userId, "Select a camera", normalMap?.CameraId);
        }
    }
}
