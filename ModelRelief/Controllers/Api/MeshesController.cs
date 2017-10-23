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
    public class MeshesController : Controller
    {
        IHostingEnvironment             _hostingEnvironment;
        UserManager<User>               _userManager;
        IResourcesProvider              _resourceProvider;
        ILogger<MeshesController>       _logger;
        Services.IConfigurationProvider _configurationProvider;
        IMapper                         _mapper;

        public MeshesController(IHostingEnvironment hostingEnvironment, UserManager<User> userManager, IResourcesProvider resourceProvider, ILogger<MeshesController> logger, Services.IConfigurationProvider configurationProvider, IMapper mapper)
        {
            _hostingEnvironment     = hostingEnvironment;
            _userManager            = userManager;
            _resourceProvider       = resourceProvider;
            _logger                 = logger;
            _configurationProvider  = configurationProvider;
            _mapper                 = mapper;
        }

        [HttpPost]
        [Consumes("application/octet-stream")]
        [DisableRequestSizeLimit]
        public async Task<ObjectResult> Post()
        { 
            // construct from body
            var meshPostRequest = new MeshPostRequest(Files.ReadToEnd(Request.Body));

            // initial validation
            var user = await Identity.GetCurrentUserAsync(_userManager, User);
            meshPostRequest.Validate(user, _resourceProvider, ModelState);
            if (!ModelState.IsValid)
                return meshPostRequest.ErrorResult(HttpContext, this);

            // populate Mesh properties
            var newMesh = new Mesh() {Name = $"{user.Id}"};
            newMesh.User = user;

            _resourceProvider.Meshes.Add(newMesh);
            var newMeshId = newMesh.Id;

            // write file : file name = newly-created Mesh Id
            var storeUsers = _configurationProvider.GetSetting(ResourcePaths.StoreUsers);
            string meshPath = $"{storeUsers}{user.Id}/meshes/{newMeshId}/";
            string meshName = $"{newMeshId}.obj";

            string fileName = $"{_hostingEnvironment.WebRootPath}{meshPath}{meshName}";
            await Files.WriteFileFromByteArray(fileName, meshPostRequest.Raw);

            // Return the mesh URI in the HTTP Response Location Header
            //  XMLHttpRequest.getResponseHeader('Location') :  http://localhost:60655/api/meshes/10
            //  XMLHttpRequest.responseText = (JSON) { id : 10 }
            string responseUrl = Url.RouteUrl( new {id = newMesh.Id});
            Uri responseUrlAbsolute = new Uri($"{Request.Scheme}://{Request.Host}{responseUrl}");

            return Created(responseUrlAbsolute, new {id = newMesh.Id});
        }

        [HttpPut ("{id?}")]
        [Consumes("application/json")]
        public async Task<ObjectResult> Put([FromBody] MeshPutRequest meshPutRequest, int id )
        { 
            // initial validation
            var user = await Identity.GetCurrentUserAsync(_userManager, User);
            meshPutRequest.Validate(user, _resourceProvider, ModelState, id);
            if (!ModelState.IsValid)
                return meshPutRequest.ErrorResult(HttpContext, this);

            // construct final mesh name from POST Mesh object
            var storeUsers  = _configurationProvider.GetSetting(ResourcePaths.StoreUsers);
            string meshPath = $"{storeUsers}{user.Id}/meshes/{id}/";
            string finalMeshFileName = $"{_hostingEnvironment.WebRootPath}{meshPath}{meshPutRequest.Name}";

            // update mesh object
            var existingMesh = _resourceProvider.Meshes.Find(id);
            existingMesh.Name = meshPutRequest.Name;
            existingMesh.Path = finalMeshFileName;
            _resourceProvider.Meshes.Update(existingMesh);

            // now rename temporary file to match the final name
            string placeholderMeshFileName = $"{_hostingEnvironment.WebRootPath}{meshPath}{id}.obj";
            System.IO.File.Move(placeholderMeshFileName, finalMeshFileName);

            Log.Information("Mesh PUT {@mesh}", meshPutRequest);

            return Ok("");
        }
    }        
}
