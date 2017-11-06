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
using ModelRelief.ViewModels;
using System;
using System.Collections.Generic;
using ModelRelief.Domain;

namespace ModelRelief.Features.Model
{
    [Authorize]
    public class ModelsController : Controller
    {
        IHostingEnvironment         _hostingEnvironment;
        IModelsProvider             _modelsProvider;
        ILogger<ModelsController>   _logger;
        IMapper                     _mapper;

        public ModelsController(IHostingEnvironment hostingEnvironment, IModelsProvider modelsrovider, ILogger<ModelsController> logger, IMapper mapper)
        {
            _hostingEnvironment = hostingEnvironment;
            _modelsProvider     = modelsrovider;
            _logger             = logger;
            _mapper             = mapper;
        }

        [AllowAnonymous]
        public IActionResult Index()
        {    
            IEnumerable<Model3d> models = _modelsProvider.Model3ds.GetAll();
            return View(models);
        }

        [Route ("[controller]/[action]/{id}")]
        public IActionResult Viewer(int id)
        {   
            _logger.LogInformation("ModelsController: model = {model}", id);
            _logger.LogWarning("ModelsController: model = {model}", id);

            Model3d model = _modelsProvider.Model3ds.Find(id);

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
            model = _modelsProvider.Model3ds.Add (model);

            return RedirectToAction ("Viewer", new { Id = model.Id});           
        }

        [HttpGet]
        [Route ("[controller]/[action]/{id}")]
        public IActionResult Edit(int id)
        {           
            Model3d model = _modelsProvider.Model3ds.Find(id);
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

            Model3d model = _modelsProvider.Model3ds.Find(id);
            if (model == null)
                return Content(String.Format("Model not found: {0}", id));

            _mapper.Map<Model3dEditViewModel, Model3d> (editModel, model);

            _modelsProvider.Model3ds.Update(model);

            return RedirectToAction ("Viewer", new { Id = model.Id});           
        }
    }        
}
