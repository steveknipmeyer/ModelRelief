// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;

using Serilog;

using ModelRelief.Models;
using ModelRelief.Services;
using ModelRelief.Utility;
using ModelRelief.ViewModels;
using Microsoft.Extensions.Logging;
using AutoMapper;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http.Internal;

namespace ModelRelief.Controllers.Api
{
    // [Authorize]
    [Area("api")]
    [Route ("api/[controller]")]        
    public class MeshesController : ApiController<Mesh>
    {
        public MeshesController(IHostingEnvironment hostingEnvironment, UserManager<User> userManager, IModelsProvider modelsProvider, ILogger<Mesh> logger, Services.IConfigurationProvider configurationProvider, IMapper mapper) :
            base (hostingEnvironment, userManager, modelsProvider.Meshes, logger, configurationProvider, mapper)
        {
        }

        [HttpPost]
        [Consumes("application/octet-stream")]
        [DisableRequestSizeLimit]
        public async Task<ObjectResult> Post()
        { 
            // construct from body
            var meshPostRequest = new MeshPostRequest(Files.ReadToEnd(Request.Body));

            // initial validation
            var user = await Identity.GetCurrentUserAsync(UserManager, User);
            meshPostRequest.Validate(user, this);
            if (!ModelState.IsValid)
                return meshPostRequest.ErrorResult(HttpContext, this);

            var filePostCommandProcessor = new FilePostCommandProcessor<Mesh>(user, this);
            return await filePostCommandProcessor.Process(meshPostRequest.Raw);
        }

        [HttpPut ("{id?}")]
        [Consumes("application/json")]
        public async Task<ObjectResult> Put([FromBody] MeshPutRequest meshPutRequest, int id )
        { 
            // initial validation
            var user = await Identity.GetCurrentUserAsync(UserManager, User);
            meshPutRequest.Validate(user, this, id);
            if (!ModelState.IsValid)
                return meshPutRequest.ErrorResult(HttpContext, this);

            var filePutCommandProcessor = new FilePutCommandProcessor<MeshPutRequest, Mesh>(user, this);
            return await filePutCommandProcessor.Process(id, meshPutRequest);
        }
    }        
}
