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
        IHostingEnvironment         _hostingEnvironment;
        ModelReliefDbContext        _dbContext;
        ILogger<MeshesController>   _logger;
        IMediator                   _mediator;
        IMapper                     _mapper;

        public MeshesController(IHostingEnvironment hostingEnvironment, ModelReliefDbContext dbContext, ILogger<MeshesController> logger, IMediator mediator, IMapper mapper)
        {
            _hostingEnvironment = hostingEnvironment;
            _dbContext          = dbContext;
            _logger             = logger;
            _mediator           = mediator;
            _mapper             = mapper;
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

#if false
            // requires jQuery ajax hook to process result and redirect from the client side
            return this.RedirectToActionJson(nameof(Index));
#endif
            return this.RedirectToAction(nameof(Index));
        }

        public ActionResult Create()
        {
            ViewBag.MeshFormats = ViewHelpers.PopulateEnumDropDownList<MeshFormat>("Select Mesh Format");
            ViewBag.ProjectId   = ViewHelpers.PopulateModelDropDownList<Project>(_dbContext.Projects, "Select a project");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Create.Command command)
        {
            await _mediator.Send(command);

            return this.RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Edit(Edit.Query message)
        {
            var model = await _mediator.Send (message);

            ViewBag.MeshFormats = ViewHelpers.PopulateEnumDropDownList<MeshFormat>("Select Mesh Format");
            ViewBag.ProjectId   = ViewHelpers.PopulateModelDropDownList<Project>(_dbContext.Projects, "Select a project", model.ProjectId);
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Edit.Command command)
        {
            await _mediator.Send(command);

            return this.RedirectToAction(nameof(Index));
        }
    }
}
