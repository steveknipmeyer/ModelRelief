using System;
using System.Collections;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

using ModelRelief.Entitities;
using ModelRelief.Services;

namespace ModelRelief.Controllers
    {
    public class ModelsController : Controller
        {
        IModel3dLocator _modelLocator;

        public ModelsController(IModel3dLocator modelLocator)
            {
            _modelLocator = modelLocator;
            }

        public IActionResult Index()
            {    
            IEnumerable<Model3d> models = _modelLocator.GetAll();
            return View(models);
            }

        public IActionResult Viewer(int id)
            {           
            Model3d model = _modelLocator.Find(id);
            if (model == null)
                return Content(String.Format("Model not found: {0}", id));

            return View (model);
            }
        }
    }
