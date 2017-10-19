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

using Serilog;

using ModelRelief.Models;
using ModelRelief.Services;
using ModelRelief.Utility;
using ModelRelief.ViewModels;
using Microsoft.Extensions.Logging;
using AutoMapper;
using System.ComponentModel.DataAnnotations;

namespace ModelRelief.Controllers.Api
{
    // [Authorize]
    [Area("Api")]
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
        public async Task<CreatedResult> Post()
        { 
            var user = await Identity.GetCurrentUserAsync(_userManager, User);

            // persist mesh : Name = User.Id
            var newMesh = new Mesh() {Name=$"{user.Id}"};
            _resourceProvider.Meshes.Add(newMesh);
            var newMeshId = newMesh.Id;

            // write file : file name = newly-created Mesh Id
            var storeUsers = _configurationProvider.GetSetting(ResourcePaths.StoreUsers);
            string meshPath = $"{storeUsers}{user.Id}/meshes/{newMeshId}/";
            string meshName = $"{newMeshId}.obj";

            string fileName = $"{_hostingEnvironment.WebRootPath}{meshPath}{meshName}";
            await Files.WriteFileFromStream(fileName, this.Request.Body);

            // Return the mesh URI in the HTTP Response Location Header
            //  XMLHttpRequest.getResponseHeader('Location') :  http://localhost:60655/api/meshes/10
            //  XMLHttpRequest.responseText = (JSON) { id : 10 }
            var responseUrl = Url.RouteUrl(new {id = newMesh.Id});
            var responseUrlAbsolute = new Uri($"{Request.Scheme}://{Request.Host}{responseUrl}");

            return Created(responseUrlAbsolute, new {id = newMesh.Id});
        }

        [HttpPut ("{id}")]
        [Consumes("application/json")]
        public async void Post([FromBody] Mesh mesh, int id )
        { 
            // construct final mesh name from POST Mesh object
            var user = await Identity.GetCurrentUserAsync(_userManager, User);
            var storeUsers  = _configurationProvider.GetSetting(ResourcePaths.StoreUsers);
            string meshPath = $"{storeUsers}{user.Id}/meshes/{id}/";
            string finalMeshFileName = $"{_hostingEnvironment.WebRootPath}{meshPath}{mesh.Name}";

            // update mesh object
            var existingMesh = _resourceProvider.Meshes.Find(id);
            existingMesh.Name = mesh.Name;
            existingMesh.Path = finalMeshFileName;
            _resourceProvider.Meshes.Update(existingMesh);

            // now rename temporary file to match the final name
            string placeholderMeshFileName = $"{_hostingEnvironment.WebRootPath}{meshPath}{id}.obj";
            System.IO.File.Move(placeholderMeshFileName, finalMeshFileName);

            Log.Information("Mesh PUT {@mesh}", mesh);

        }
    }        
}
