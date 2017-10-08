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

namespace ModelRelief.Controllers.Api
{
    // [Authorize]
    [Area("Api")]
    [Route ("api/[controller]")]        
    public class MeshesController : Controller
    {
        IHostingEnvironment             _hostingEnvironment;
        IResourcesProvider              _resourceProvider;
        ILogger<MeshesController>       _logger;
        Services.IConfigurationProvider _configurationProvider;
        IMapper                         _mapper;

        public MeshesController(IHostingEnvironment hostingEnvironment, IResourcesProvider resourceProvider, ILogger<MeshesController> logger, Services.IConfigurationProvider configurationProvider, IMapper mapper)
        {
            _hostingEnvironment     = hostingEnvironment;
            _resourceProvider       = resourceProvider;
            _logger                 = logger;
            _configurationProvider  = configurationProvider;
            _mapper                 = mapper;
        }

        [HttpPost]
        [Consumes("application/octet-stream")]
        [DisableRequestSizeLimit]
        public ContentResult Post()
        { 
            var userId     = Identity.GetUserId(User);

            var newMesh = new Mesh() {Name=$"{userId}"};
            _resourceProvider.Meshes.Add(newMesh);
            var newMeshId = newMesh.Id;

            var storeUsers = _configurationProvider.GetSetting("ResourcePaths:StoreUsers");
            string meshPath = $"{storeUsers}{userId}/meshes/{newMeshId}/";
            string meshName = $"{newMeshId}.obj";

            string fileName = $"{_hostingEnvironment.WebRootPath}{meshPath}{meshName}";
            Files.WriteFileFromStream(fileName, this.Request.Body);

            var meshUri = new Uri($"{Request.Scheme}://{Request.Host}/api/meshes/{newMeshId}", UriKind.Absolute);

            // Return the mesh URI in the HTTP Response
            return Content(meshUri.AbsoluteUri);
        }

        [HttpPut ("{id}")]
        [Consumes("application/json")]
        public void Post([FromBody] Mesh mesh, int id )
        { 
            var userId      = Identity.GetUserId(User);
            var storeUsers  = _configurationProvider.GetSetting("ResourcePaths:StoreUsers");
            string meshPath = $"{storeUsers}{userId}/meshes/{id}/";
            string meshName = $"{mesh.Name}";
            string fileName = $"{_hostingEnvironment.WebRootPath}{meshPath}{meshName}";

            var existingMesh = _resourceProvider.Meshes.Find(id);
            existingMesh.Name = mesh.Name;
            existingMesh.Path = fileName;

            _resourceProvider.Meshes.Update(existingMesh);

            // now rename temporary file to match the final name
            string existingFileName = $"{_hostingEnvironment.WebRootPath}{meshPath}{id}.obj";
            System.IO.File.Move(existingFileName, fileName);

            Log.Information("Mesh PUT {@mesh}", mesh);
        }
    }        
}
