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
    public class DepthBuffersController : Controller
    {
        IHostingEnvironment _hostingEnvironment;
        IResourcesLocator     _resourceLocator;

        public DepthBuffersController(IHostingEnvironment hostingEnvironment, IResourcesLocator resourceLocator)
        {
            _hostingEnvironment = hostingEnvironment;
            _resourceLocator    = resourceLocator;
        }

        [HttpPost]
        [Route("[controller]/[action]")]
        public void Create()
        { 
        #if false            
            // How is the depth buffer name passed in the request? Possibly, as part of the URL.
            // mesh/create/<meshName>
            string depthBufferPath = "";
            string depthBufferName = "";

            string fileName = $"{_hostingEnvironment.WebRootPath}{depthBufferPath}{Path.GetFileNameWithoutExtension(depthBufferName)}.relief.obj";
            Files.WriteFileFromStream(fileName, this.Request.Body);
            
            // Return the depth buffer URL in the HTTP Response...
        #endif            
        }
    }        
}
