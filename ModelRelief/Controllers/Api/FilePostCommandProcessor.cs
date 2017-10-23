// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Models;
using ModelRelief.Services;
using ModelRelief.Utility;
using System;
using System.Threading.Tasks;

namespace ModelRelief.Controllers.Api
{
    /// <summary>
    /// Handles file creation from a POST request.
    /// </summary>
    /// <typeparam name="TResource"></typeparam>
    public class FilePostCommandProcessor<TResource> 
        where TResource: ModelReliefEntity, new()
    {
        User                     _user;
        ApiController<TResource> _controller;
        byte[]                   _byteArray;

        public FilePostCommandProcessor(User user, ApiController<TResource> controller, byte[] byteArray)
        {
        _user       = user;
        _controller = controller;
         _byteArray = byteArray;
        }

        /// <summary>
        /// Create a file resource from a POST request.
        /// </summary>
        /// <returns></returns>
        async public Task<ObjectResult> Process()
        {
            // populate resource properties
            var newResource = new TResource() {Name = $"{_user.Id}"};
            newResource.User = _user;

            _controller.ResourceProvider.Add(newResource);

            // write file : file name = newly-created resource Id
            var storeUsers = _controller.ConfigurationProvider.GetSetting(ResourcePaths.StoreUsers);
            string meshPath = $"{storeUsers}{_user.Id}/meshes/{newResource.Id}/";
            string meshName = $"{newResource.Id}.obj";

            string fileName = $"{_controller.HostingEnvironment.WebRootPath}{meshPath}{meshName}";
            await Files.WriteFileFromByteArray(fileName, _byteArray);

            // Return the mesh URI in the HTTP Response Location Header
            //  XMLHttpRequest.getResponseHeader('Location') :  http://localhost:60655/api/meshes/10
            //  XMLHttpRequest.responseText = (JSON) { id : 10 }
            string responseUrl = _controller.Url.RouteUrl( new {id = newResource.Id});
            Uri responseUrlAbsolute = new Uri($"{_controller.Request.Scheme}://{_controller.Request.Host}{responseUrl}");

            return _controller.Created(responseUrlAbsolute, new {id = newResource.Id});
        }
    }
}
