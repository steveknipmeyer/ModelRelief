using System;
using System.Collections;
using System.Collections.Generic;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;

using ModelRelief.Entitities;
using ModelRelief.Services;
using ModelRelief.ViewModels;

namespace ModelRelief.Controllers
    {
    [Authorize]
    public class ModelsController : Controller
        {
        IModel3dLocator _modelLocator;
        
        public ModelsController(IModel3dLocator modelLocator)
            {
            _modelLocator = modelLocator;
            }

        [AllowAnonymous]
        public IActionResult Index()
            {    
            IEnumerable<Model3d> models = _modelLocator.GetAll();
            return View(models);
            }

        [Route ("[controller]/[action]/{modelId}")]
        public IActionResult Viewer(int modelid)
            {           
            Model3d model = _modelLocator.Find(modelid);
            if (model == null)
                return Content(String.Format("Model not found: {0}", modelid));

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

            var model = new Model3d()
                {
                Name   = editModel.Name,
                Format = editModel.Format
                };

            model = _modelLocator.Add (model);
            _modelLocator.Commit();

            return RedirectToAction ("Viewer", new { Id = model.Id});           
            }

        [HttpGet]
        [Route ("[controller]/[action]/{modelId}")]
        public IActionResult Edit(int modelId)
            {           
            Model3d model = _modelLocator.Find(modelId);
            if (model == null)
                return Content(String.Format("Model not found: {0}", modelId));

            var editModel = new Model3dEditViewModel
                {
                Name   = model.Name,
                Format = model.Format
                };

            return View (editModel);
            }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route ("[controller]/[action]/{modelId}")]
        public IActionResult Edit(int modelId, Model3dEditViewModel editModel)
            {           
            if (!ModelState.IsValid)
                {
                // re-display with validation messages
                return View();
                }

            Model3d model = _modelLocator.Find(modelId);
            if (model == null)
                return Content(String.Format("Model not found: {0}", modelId));

            // copy properties
            model.Name   = editModel.Name;
            model.Format = editModel.Format;

            _modelLocator.Commit();

            return RedirectToAction ("Viewer", new { Id = model.Id});           
            }

        }
    }
