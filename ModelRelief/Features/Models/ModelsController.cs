// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using ModelRelief.Api.V2.Shared.Rest;
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
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        public ModelsController(ModelReliefDbContext dbContext, IMapper mapper, IMediator mediator)
            : base(dbContext, mapper, mediator)
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

            return View(model);
        }
        
        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="projectId">Project Id to select</param>
        protected override void InitializeViewControls(Dto.Model3d model)
        {
            ViewBag.ModelFormats = ViewHelpers.PopulateEnumDropDownList<Model3dFormat>("Select Model Format");
            ViewBag.ProjectId    = ViewHelpers.PopulateModelDropDownList<Project>(DbContext.Projects, "Select a project", model?.ProjectId);
            ViewBag.CameraId     = ViewHelpers.PopulateModelDropDownList<Camera>(DbContext.Cameras, "Select a camera", model?.CameraId);
        }
    }
}
