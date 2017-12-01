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

namespace ModelRelief.Features.Meshes
{
    /// <summary>
    /// Represents a controller to handle Mesh API requests.
    /// </summary>
    [Authorize]
    public class MeshesController : ViewController<Domain.Mesh, Dto.Mesh, Dto.Mesh, Dto.Mesh>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        public MeshesController(ModelReliefDbContext dbContext, IMapper mapper, IMediator mediator)
            : base(dbContext, mapper, mediator)
        {
        }
        
        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="mesh">Mesh instance for View.</param>
        protected override void InitializeViewControls(Dto.Mesh mesh = null)
        {
            ViewBag.MeshFormats     = ViewHelpers.PopulateEnumDropDownList<MeshFormat>("Select Mesh Format");
            ViewBag.ProjectId       = ViewHelpers.PopulateModelDropDownList<Project>(DbContext.Projects, "Select a project", mesh?.ProjectId);
            ViewBag.CameraId        = ViewHelpers.PopulateModelDropDownList<Camera>(DbContext.Cameras, "Select a camera", mesh?.CameraId);
            ViewBag.DepthBufferId   = ViewHelpers.PopulateModelDropDownList<DepthBuffer>(DbContext.DepthBuffers, "Select a depth buffer", mesh?.DepthBufferId);
            ViewBag.MeshTransformId = ViewHelpers.PopulateModelDropDownList<MeshTransform>(DbContext.MeshTransforms, "Select a mesh transform", mesh?.CameraId);
        }
    }
}
