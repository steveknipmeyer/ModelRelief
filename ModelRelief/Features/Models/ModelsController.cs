// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Services;
using ModelRelief.Utility;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ModelRelief.Features.Models
{
    /// <summary>
    /// Represents a controller to handle Model Ux requests.
    /// </summary>
    [Authorize]
    public class ModelsController : ViewController<Domain.Model3d, Dto.Model3d, Dto.Model3d, Dto.Model3d>
    {
        public Services.IConfigurationProvider ConfigurationProvider { get; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="userManager">UserManager (ClaimsPrincipal -> ApplicationUser).</param>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        /// <param name="configurationProvider">Configuration provider.</param>
        public ModelsController(UserManager<ApplicationUser> userManager, ModelReliefDbContext dbContext, IMapper mapper, IMediator mediator, Services.IConfigurationProvider configurationProvider)
            : base(userManager, dbContext, mapper, mediator)
        {
            ConfigurationProvider = configurationProvider;
        }


        /// <summary>
        /// Action handler for a Viewer request.
        /// </summary>
        /// <param name="id">Model Id.</param>
        /// <returns>Viewer page.</returns>
        public async Task<IActionResult> Viewer (int id)
        {
            var model = await HandleRequestAsync(new GetSingleRequest<Domain.Model3d, Dto.Model3d> 
            {
                User = User,
                Id = id
            });

            // WIP: Publish path of model for THREE loader.
            var domainModel = await DbContext.Set<Domain.Model3d>().FindAsync(new object[] {id});
            ViewData["ModelName"] = domainModel.Name;
            ViewData["ModelPath"] = domainModel.GetRelativePath(ConfigurationProvider.GetSetting(ResourcePaths.StoreUsers));
            return View(model);
        }
        
        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="model">Model instance for View.</param>
        protected async override Task InitializeViewControls(Dto.Model3d model)
        {
            var applicationUser = await Identity.FindApplicationUserAsync(UserManager, User);
            var userId = applicationUser?.Id ?? "";

            ViewBag.ModelFormat  = ViewHelpers.PopulateEnumDropDownList<Model3dFormat>("Select model format");

            ViewBag.ProjectId    = ViewHelpers.PopulateModelDropDownList<Project>(DbContext, userId, "Select a project", model?.ProjectId);
            ViewBag.CameraId     = ViewHelpers.PopulateModelDropDownList<Camera>(DbContext, userId, "Select a camera", model?.CameraId);
        }
    }
}
