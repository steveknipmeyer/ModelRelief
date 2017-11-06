// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Domain;
using ModelRelief.Services;
using System.Collections.Generic;

namespace ModelRelief.Controllers.Api
{
    // [Authorize]
    [Area("Api")]
    [Route ("api/[controller]")]        
    public class ModelsController : Controller
    {
        IHostingEnvironment _hostingEnvironment;
        IModelsProvider     _modelsProvider;

        public ModelsController(IHostingEnvironment hostingEnvironment, IModelsProvider modelsProvider)
        {
            _hostingEnvironment = hostingEnvironment;
            _modelsProvider     = modelsProvider;
        }

        [HttpGet]
        public IEnumerable<Model3d> Get()
        { 
            IEnumerable<Model3d> models = _modelsProvider.Model3ds.GetAll();
            return models;
        }

        [HttpGet("{id}")]
        public Model3d Get(int id)
        {
            Model3d model = _modelsProvider.Model3ds.Find(id);
            return model;
        } 

        [HttpPost]
        public Model3d Post([FromBody] Model3d model)
        { 
            Model3d newModel = _modelsProvider.Model3ds.Add(new Model3d {
                Name = model.Name
            });                    
            return newModel;
        }

        [HttpPut]
        public Model3d Put([FromBody] Model3d model)
        { 
            _modelsProvider.Model3ds.Update(model);
            return model;
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        { 
            _modelsProvider.Model3ds.Delete(id);
        }        
    }        
}
