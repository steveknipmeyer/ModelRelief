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

using ModelRelief.Entities;
using ModelRelief.Services;
using ModelRelief.Utility;
using ModelRelief.ViewModels;

namespace ModelRelief.Controllers.Api
{
    // [Authorize]
    [Area("Api")]
    [Route ("api/depth-buffers")]        
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
        [Consumes("application/octet-stream")]       
        public void Post()
        { 
            // How is the depthbuffer name passed in the request? Is a multi-part form required?
            string depthBufferPath = "/store/users/7b4f6c4a-9113-4f7b-9ca2-9d1358ad5f20/depthbuffers/apiTest/";
            string depthBufferName = "depthBuffer.raw";

            string fileName = $"{_hostingEnvironment.WebRootPath}{depthBufferPath}{depthBufferName}";
            Files.WriteFileFromStream(fileName, this.Request.Body);
            
            // Return the depth buffer URL in the HTTP Response...
        }

        [HttpPost]
        [Consumes("application/json")]
        public void Post([FromBody] DepthBuffer depthBuffer)
        { 
        }
    }        
}
