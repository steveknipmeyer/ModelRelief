using System;
using Microsoft.AspNetCore.Mvc;

using ModelRelief.Models;
using ModelRelief.Services;

namespace ModelRelief.Controllers
    {
    public class HomeController : Controller
        {
        IModelLocator _modelLocator;

        public HomeController(IModelLocator modelLocator)
            {
            _modelLocator = modelLocator;
            }

        public IActionResult Index()
            {
            // extract the query string
            string idString = this.Request.Query["id"];
            int modelId = Convert.ToInt32(idString);

            Model3d model = _modelLocator.Find(modelId);

            return View (model);
            }
        }
    }
