using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Database;
using ModelRelief.Domain;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using AutoMapper;
using MediatR;

namespace ModelRelief.Features.Models
{
    public class ModelsController : Controller
    {
        ModelReliefDbContext        _dbContext;
        ILogger<ModelsController>   _logger;
        IMapper                     _mapper;
        IMediator                   _mediator;

        public ModelsController(ModelReliefDbContext dbContext, ILogger<ModelsController> logger, IMapper mapper, IMediator mediator)
        {
            _dbContext          = dbContext;
            _logger             = logger;
            _mapper             = mapper;
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

       public async Task<IActionResult> Viewer (Details.Query query)
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
            InitializeViewControls();
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

            InitializeViewControls(model);
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
        private void InitializeViewControls(Dto.Model3d model = null)
        {
            ViewBag.ModelFormats    = ViewHelpers.PopulateEnumDropDownList<Model3dFormat>("Select Model Format");
            ViewBag.ProjectId       = ViewHelpers.PopulateModelDropDownList<Project>(_dbContext.Projects, "Select a project", model?.ProjectId);
            ViewBag.CameraId        = ViewHelpers.PopulateModelDropDownList<Camera>(_dbContext.Cameras, "Select a camera", model?.CameraId);
        }
    }
}
