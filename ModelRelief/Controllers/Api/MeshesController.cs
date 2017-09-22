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
    public class MeshesController : Controller
    {
        IHostingEnvironment _hostingEnvironment;
        IResourcesProvider  _resourceProvider;

        public MeshesController(IHostingEnvironment hostingEnvironment, IResourcesProvider resourceProvider)
        {
            _hostingEnvironment = hostingEnvironment;
            _resourceProvider   = resourceProvider;
        }

        [HttpPost]
        [Consumes("application/octet-stream")]
        public void Post()
        { 
            // How is the mesh name passed in the request? Is a multi-part form required?
            string meshPath = "/store/users/10754914-7e02-4bdc-ac7d-d22e6f5efebf/meshes/apiTest/";
            string meshName = "mesh.obj";

            string fileName = $"{_hostingEnvironment.WebRootPath}{meshPath}{meshName}";
            Files.WriteFileFromStream(fileName, this.Request.Body);
            
            // Return the mesh URL in the HTTP Response...
        }

        [HttpPost]
        [Consumes("application/json")]
        public void Post([FromBody] Mesh mesh )
        { 
        }
    }        
}
