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
    public class MeshesController : Controller
    {
        IHostingEnvironment _hostingEnvironment;
        IResourcesLocator    _resourceLocator;
        public MeshesController(IHostingEnvironment hostingEnvironment, IResourcesLocator resourceLocator)
        {
            _hostingEnvironment = hostingEnvironment;
            _resourceLocator    = resourceLocator;
        }

        [HttpPost]
        [Route("[controller]/[action]")]
        public void Create()
        { 
        #if false            
            // How is the mesh name passed in the request? Possibly, as part of the URL.
            // mesh/create/<meshName>
            string meshPath = "";
            string meshName = "";

            string fileName = $"{_hostingEnvironment.WebRootPath}{meshPath}{Path.GetFileNameWithoutExtension(meshName)}.relief.obj";
            Files.WriteFileFromStream(fileName, this.Request.Body);
            
            // Return the mesh URL in the HTTP Response...
        #endif            
        }
    }        
}
