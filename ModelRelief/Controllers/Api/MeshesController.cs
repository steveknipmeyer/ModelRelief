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
        public MeshesController(IHostingEnvironment hostingEnvironment, UserManager<User> userManager, IResourcesProvider resourcesProvider, ILogger<MeshesController> logger, Services.IConfigurationProvider configurationProvider, IMapper mapper) :
            base (hostingEnvironment, userManager, resourcesProvider.Meshes, logger, configurationProvider, mapper)
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

#if false
            // construct final mesh name from POST Mesh object
            var storeUsers  = ConfigurationProvider.GetSetting(ResourcePaths.StoreUsers);
            string meshPath = $"{storeUsers}{user.Id}/meshes/{id}/";
            string finalMeshFileName = $"{HostingEnvironment.WebRootPath}{meshPath}{meshPutRequest.Name}";

            // update mesh object
            var existingMesh = ResourceProvider.Find(id);
            existingMesh.Name = meshPutRequest.Name;
            existingMesh.Path = finalMeshFileName;
            ResourceProvider.Update(existingMesh);

            // now rename temporary file to match the final name
            string placeholderMeshFileName = $"{HostingEnvironment.WebRootPath}{meshPath}{id}.obj";
            System.IO.File.Move(placeholderMeshFileName, finalMeshFileName);

            Log.Information("Mesh PUT {@mesh}", meshPutRequest);

            return Ok("");
#else
            var filePutCommandProcessor = new FilePutCommandProcessor<MeshPutRequest, Mesh>(user, this);
            return await filePutCommandProcessor.Process(id, meshPutRequest);
#endif
        }
    }        
}
