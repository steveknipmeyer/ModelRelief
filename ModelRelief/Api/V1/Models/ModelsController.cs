// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Services;
using System.Collections.Generic;

namespace ModelRelief.Api.V1.Models
{
    // [Authorize]
    [Area("Api")]
    [Route ("api/[controller]")]        
    public class ModelsController : Controller
    {
        IHostingEnvironment _hostingEnvironment;
        ModelReliefDbContext _dbContext;

        public ModelsController(IHostingEnvironment hostingEnvironment, ModelReliefDbContext dbContext)
        {
            _hostingEnvironment = hostingEnvironment;
            _dbContext          = dbContext;
        }

        [HttpGet]
        public IEnumerable<Model3d> Get()
        { 
            IEnumerable<Model3d> models = _dbContext.Models;
            return models;
        }

        [HttpGet("{id}")]
        public Model3d Get(int id)
        {
            Model3d model = _dbContext.Models.Find(id);
            return model;
        } 

        [HttpPost]
        public Model3d Post([FromBody] Model3d model)
        { 
            Model3d newModel = new Model3d {
                Name = model.Name
            };                    
            _dbContext.Models.Add(newModel);

            return newModel;
        }

        [HttpPut]
        public Model3d Put([FromBody] Model3d model)
        { 
            _dbContext.Models.Update(model);
            return model;
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        { 
            var model = _dbContext.Models.Find(id);
            _dbContext.Models.Remove(model);
        }        
    }        
}
