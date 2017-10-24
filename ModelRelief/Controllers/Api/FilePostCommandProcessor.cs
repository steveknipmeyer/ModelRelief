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

        public FilePostCommandProcessor(User user, ApiController<TResource> controller)
        {
        _user       = user;
        _controller = controller;
        }

        /// <summary>
        /// Create a file resource from a POST request.
        /// </summary>
        /// <returns></returns>
        async public Task<ObjectResult> Process(byte[] byteArray)
        {
            // populate resource properties
            var newResource = new TResource() {Name = $"{_user.Id}"};
            newResource.User = _user;

            _controller.ResourceProvider.Add(newResource);

            // write file : file name = newly-created resource Id
            var storeUsers = _controller.ConfigurationProvider.GetSetting(ResourcePaths.StoreUsers);
            string resourcePath = $"{storeUsers}{_user.Id}/meshes/{newResource.Id}/";
            string resourceName = $"{newResource.Id}.obj";

            string fileName = $"{_controller.HostingEnvironment.WebRootPath}{resourcePath}{resourceName}";
            await Files.WriteFileFromByteArray(fileName, byteArray);

            // Return the resource3 URI in the HTTP Response Location Header
            //  XMLHttpRequest.getResponseHeader('Location') :  http://localhost:60655/api/meshes/10
            //  XMLHttpRequest.responseText = (JSON) { id : 10 }
            string responseUrl = _controller.Url.RouteUrl( new {id = newResource.Id});
            Uri responseUrlAbsolute = new Uri($"{_controller.Request.Scheme}://{_controller.Request.Host}{responseUrl}");

            return _controller.Created(responseUrlAbsolute, new {id = newResource.Id});
        }
    }
}
