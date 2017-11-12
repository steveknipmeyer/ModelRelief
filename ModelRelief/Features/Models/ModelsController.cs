// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ModelRelief.Services;
using System;
using System.Collections.Generic;
using ModelRelief.Domain;
using ModelRelief.Database;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ModelRelief.Features.Models
{
    [Authorize]
    public class ModelsController : Controller
    {
        IHostingEnvironment         _hostingEnvironment;
        ModelReliefDbContext        _dbContext;
        ILogger<ModelsController>   _logger;
        IMapper                     _mapper;

        public ModelsController(IHostingEnvironment hostingEnvironment, ModelReliefDbContext dbContext, ILogger<ModelsController> logger, IMapper mapper)
        {
            _hostingEnvironment = hostingEnvironment;
            _dbContext          = dbContext;
            _logger             = logger;
            _mapper             = mapper;
        }

        [AllowAnonymous]
        public async Task<IActionResult> Index()
        {    
            IEnumerable<Model3d> models = await _dbContext.Models.ToListAsync();
            return View(models);
        }

        [Route ("[controller]/[action]/{id}")]
        public IActionResult Viewer(int id)
        {   
            _logger.LogInformation("ModelsController: model = {model}", id);
            _logger.LogWarning("ModelsController: model = {model}", id);

            Model3d model = _dbContext.Models.Find(id);

            if (model == null)
                return Content(String.Format("Model not found: {0}", id));

            return View (model);
        }

        [HttpGet]
        public IActionResult Create()
        {           
            return View ();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Model3dEditViewModel editModel)
        {           
            if (!ModelState.IsValid)
            {
                // re-display with validation messages 
                return View();
            }

            var model = _mapper.Map<Model3dEditViewModel, Model3d> (editModel);
            _dbContext.Models.Add (model);

            return RedirectToAction ("Viewer", new { Id = model.Id});           
        }

        [HttpGet]
        [Route ("[controller]/[action]/{id}")]
        public IActionResult Edit(int id)
        {           
            Model3d model = _dbContext.Models.Find(id);
            if (model == null)
                return Content(String.Format("Model not found: {0}", id));

            var editModel = _mapper.Map<Model3d, Model3dEditViewModel> (model);

            return View (editModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route ("[controller]/[action]/{id}")]
        public IActionResult Edit(int id, Model3dEditViewModel editModel)
            {           
            if (!ModelState.IsValid)
            {
                // re-display with validation messages
                return View();
            }

            Model3d model = _dbContext.Models.Find(id);
            if (model == null)
                return Content(String.Format("Model not found: {0}", id));

            _mapper.Map<Model3dEditViewModel, Model3d> (editModel, model);
            _dbContext.Models.Update(model);

            return RedirectToAction ("Viewer", new { Id = model.Id});           
        }
    }        
}
