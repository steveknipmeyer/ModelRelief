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

using ModelRelief.Models;
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
        }

        [HttpPost]
        [Consumes("application/json")]
        public void Post([FromBody] DepthBuffer depthBuffer)
        { 
        }
    }        
}
