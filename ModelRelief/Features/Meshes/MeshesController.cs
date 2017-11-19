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
using ModelRelief.Database;
using ModelRelief.Domain;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ModelRelief.Features.Meshes
{
    [Authorize]
    public class MeshesController : Controller
    {
        ModelReliefDbContext        _dbContext;
        ILogger<MeshesController>   _logger;
        IMediator                   _mediator;

        public MeshesController(ModelReliefDbContext dbContext, ILogger<MeshesController> logger, IMediator mediator)
        {
            _dbContext          = dbContext;
            _logger             = logger;
            _mediator           = mediator;
        }

        public async Task<IActionResult> Index (Index.Query query)
        {
            var model = await _mediator.Send (query);

            return View(model);
        }

       public async Task<IActionResult> Details (Details.Query query)
       {
            var model = await _mediator.Send (query);

            return View(model);
       }

        public async Task<IActionResult> Delete(Delete.Query query)
        {
            var model = await _mediator.Send(query);

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(Delete.Command command)
        {
            await _mediator.Send(command);

            return this.RedirectToAction(nameof(Index));
        }

        [HttpGet]
        public ActionResult Create()
        {
            InitializeViewHelpers();
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Create.Command command)
        {
            await _mediator.Send(command);

            return this.RedirectToAction(nameof(Index));
        }

        [HttpGet]
        public async Task<IActionResult> Edit(Edit.Query message)
        {
            var model = await _mediator.Send(message);

            InitializeViewHelpers(model);
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Edit.Command command)
        {
            await _mediator.Send(command);

            return this.RedirectToAction(nameof(Index));
        }
        
        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="projectId">Project Id to select</param>
        private void InitializeViewHelpers(Dto.Mesh mesh = null)
        {
            ViewBag.MeshFormats     = ViewHelpers.PopulateEnumDropDownList<MeshFormat>("Select Mesh Format");
            ViewBag.ProjectId       = ViewHelpers.PopulateModelDropDownList<Project>(_dbContext.Projects, "Select a project", mesh?.ProjectId);
            ViewBag.CameraId        = ViewHelpers.PopulateModelDropDownList<Camera>(_dbContext.Cameras, "Select a camera", mesh?.CameraId);
            ViewBag.DepthBufferId   = ViewHelpers.PopulateModelDropDownList<DepthBuffer>(_dbContext.DepthBuffers, "Select a depth buffer", mesh?.DepthBufferId);
            ViewBag.MeshTransformId = ViewHelpers.PopulateModelDropDownList<MeshTransform>(_dbContext.MeshTransforms, "Select a mesh transform", mesh?.CameraId);
        }
    }
}
