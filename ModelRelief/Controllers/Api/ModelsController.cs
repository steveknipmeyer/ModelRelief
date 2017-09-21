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

namespace ModelRelief.Controllers.Api
{
    // [Authorize]
    [Area("Api")]
    [Route ("api/[controller]")]        
    public class ModelsController : Controller
    {
        IHostingEnvironment _hostingEnvironment;
        IResourcesProvider  _resourceProvider;

        public ModelsController(IHostingEnvironment hostingEnvironment, IResourcesProvider resourceProvider)
        {
            _hostingEnvironment = hostingEnvironment;
            _resourceProvider   = resourceProvider;
        }

        [HttpGet]
        public IEnumerable<Model3d> Get()
        { 
            IEnumerable<Model3d> models = _resourceProvider.Models.GetAll();
            return models;
        }

        [HttpGet("{id}")]
        public Model3d Get(int id)
        {
            Model3d model = _resourceProvider.Models.Find(id);
            return model;
        } 

        [HttpPost]
        public Model3d Post([FromBody] Model3d model)
        { 
            Model3d newModel = _resourceProvider.Models.Add(new Model3d {
                Name = model.Name
            });                    
            return newModel;
        }

        [HttpPut]
        public Model3d Put([FromBody] Model3d model)
        { 
            _resourceProvider.Models.Update(model);
            return model;
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        { 
            _resourceProvider.Models.Delete(id);
        }        
    }        
}
