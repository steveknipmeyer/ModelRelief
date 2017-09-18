// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;

using ModelRelief.Entitities;
using ModelRelief.Services;
using ModelRelief.Utility;
using ModelRelief.ViewModels;

namespace ModelRelief.Controllers
{
    [Authorize]
    public class ModelsController : Controller
    {
        IHostingEnvironment _hostingEnvironment;
        UserManager<User>   _userManager;
        IResourcesProvider  _resourceProvider;

        public ModelsController(IHostingEnvironment hostingEnvironment, UserManager<User> userManager, IResourcesProvider resourceProvider)
        {
            _hostingEnvironment = hostingEnvironment;
            _userManager        = userManager;
            _resourceProvider   = resourceProvider;
        }

        [AllowAnonymous]
        public IActionResult Index()
        {    
            IEnumerable<Model3d> models = _resourceProvider.Models.GetAll();
            return View(models);
        }

        [Route ("[controller]/[action]/{modelId}")]
        public IActionResult Viewer(string modelid)
        {   
            Model3d model = _resourceProvider.Models.Find(modelid);

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

            model = _resourceProvider.Models.Add (model);
            _resourceProvider.Models.Commit();

            return RedirectToAction ("Viewer", new { Id = model.Id});           
        }

        [HttpGet]
        [Route ("[controller]/[action]/{modelId}")]
        public IActionResult Edit(string modelId)
        {           
            Model3d model = _resourceProvider.Models.Find(modelId);
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
        public IActionResult Edit(string modelId, Model3dEditViewModel editModel)
            {           
            if (!ModelState.IsValid)
            {
                // re-display with validation messages
                return View();
            }

            Model3d model = _resourceProvider.Models.Find(modelId);
            if (model == null)
                return Content(String.Format("Model not found: {0}", modelId));

            // copy properties
            model.Name   = editModel.Name;
            model.Format = editModel.Format;

            _resourceProvider.Models.Commit();

            return RedirectToAction ("Viewer", new { Id = model.Id});           
        }
    }        
}
