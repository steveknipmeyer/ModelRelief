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
    /// <typeparam name="TModel"></typeparam>
    public class FilePostCommandProcessor<TModel> 
        where TModel: ModelReliefModel, new()
    {
        User                   _user;
        ApiController<TModel>  _controller;

        public FilePostCommandProcessor(User user, ApiController<TModel> controller)
        {
        _user       = user;
        _controller = controller;
        }

        /// <summary>
        /// Create a file from a POST request.
        /// </summary>
        /// <returns></returns>
        async public Task<ObjectResult> Process(byte[] byteArray)
        {
            // populate model properties
            var newModel = new TModel() {Name = $"{_user.Id}"};
            newModel.User = _user;

            _controller.ModelProvider.Add(newModel);

            // write file : file name = newly-created model Id
            var storeUsers  = _controller.ConfigurationProvider.GetSetting(ResourcePaths.StoreUsers);
            var modelFolder = _controller.ConfigurationProvider.GetSetting(($"{ResourcePaths.ModelFolders}:{typeof(TModel).Name}"));
            string modelPath = $"{storeUsers}{_user.Id}/{modelFolder}/{newModel.Id}/";
            string modelName = $"{newModel.Id}.obj";

            string fileName = $"{_controller.HostingEnvironment.WebRootPath}{modelPath}{modelName}";
            await Files.WriteFileFromByteArray(fileName, byteArray);

            // Return the model URI in the HTTP Response Location Header
            //  XMLHttpRequest.getResponseHeader('Location') :  http://localhost:60655/api/meshes/10
            //  XMLHttpRequest.responseText = (JSON) { id : 10 }
            string responseUrl = _controller.Url.RouteUrl( new {id = newModel.Id});
            Uri responseUrlAbsolute = new Uri($"{_controller.Request.Scheme}://{_controller.Request.Host}{responseUrl}");

            return _controller.Created(responseUrlAbsolute, new {id = newModel.Id});
        }
    }
}
