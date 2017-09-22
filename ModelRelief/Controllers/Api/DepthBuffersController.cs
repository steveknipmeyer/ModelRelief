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
    public class DepthBuffersController : Controller
    {
        IHostingEnvironment _hostingEnvironment;
        IResourcesProvider  _resourceProvider;

        public DepthBuffersController(IHostingEnvironment hostingEnvironment, IResourcesProvider resourceProvider)
        {
            _hostingEnvironment = hostingEnvironment;
            _resourceProvider   = resourceProvider;
        }

        [HttpPost]
//      public void Post([FromBody] DepthBuffer depthBuffer)
        public void Post()
        { 
            // How is the depthbuffer name passed in the request? Is a multi-part form required?
            string depthBufferPath = "/store/users/10754914-7e02-4bdc-ac7d-d22e6f5efebf/depthbuffers/apiTest/";
            string depthBufferName = "depthBuffer.raw";

            string fileName = $"{_hostingEnvironment.WebRootPath}{depthBufferPath}{depthBufferName}";
            Files.WriteFileFromStream(fileName, this.Request.Body);
            
            // Return the depth buffer URL in the HTTP Response...
        }
    }        
}
