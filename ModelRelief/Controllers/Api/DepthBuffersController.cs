// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ModelRelief.Models;
using ModelRelief.Services;

namespace ModelRelief.Controllers.Api
{
    // [Authorize]
    [Area("Api")]
    [Route ("api/depth-buffers")]        
    public class DepthBuffersController : ApiController<DepthBuffer>
    {

        public DepthBuffersController(IHostingEnvironment hostingEnvironment, UserManager<User> userManager, IModelsProvider modelsProvider, ILogger<DepthBuffer> logger, Services.IConfigurationProvider configurationProvider, IMapper mapper) :
            base (hostingEnvironment, userManager, modelsProvider.DepthBuffers, logger, configurationProvider, mapper)
        {
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
