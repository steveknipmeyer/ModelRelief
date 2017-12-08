﻿// ------------------------------------------------------------------------// 
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
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ModelRelief.Features.Models
{
    /// <summary>
    /// Represents a controller to handle Model API requests.
    /// </summary>
    [Authorize]
    public class ModelsController : ViewController<Domain.Model3d, Dto.Model3d, Dto.Model3d, Dto.Model3d>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="userManager">UserManager to convert from ClaimsPrincipal to ApplicationUser.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        public ModelsController(ModelReliefDbContext dbContext, UserManager<ApplicationUser> userManager, IMapper mapper, IMediator mediator)
            : base(dbContext, userManager, mapper, mediator)
        {
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
                Id = id
            });

            // WIP: Publish path of model for THREE loader.
            var domainModel = await DbContext.Set<Domain.Model3d>().FindAsync(new object[] {id});
            // WIP: How will model file extensions be handled?
            ViewData["ModelName"] = $"{domainModel.Name}.obj";
            ViewData["ModelPath"] = domainModel.Path;

            return View(model);
        }
        
        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="model">Model instance for View.</param>
        protected async override Task InitializeViewControls(Dto.Model3d model)
        {
            var applicationUser = await FindApplicationUser();
            var userId = applicationUser.Id;

            ViewBag.ModelFormats = ViewHelpers.PopulateEnumDropDownList<Model3dFormat>("Select Model Format");
            ViewBag.ProjectId    = ViewHelpers.PopulateModelDropDownList<Project>(DbContext, userId, "Select a project", model?.ProjectId);
            ViewBag.CameraId     = ViewHelpers.PopulateModelDropDownList<Camera>(DbContext, userId, "Select a camera", model?.CameraId);
        }
    }
}
