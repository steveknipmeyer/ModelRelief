// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Infrastructure;
using ModelRelief.Domain;
using ModelRelief.Features;
using ModelRelief.Services;
using ModelRelief.Utility;
using System;
using System.Threading.Tasks;

namespace ModelRelief.Api.V1
{
    /// <summary>
    /// Handles file creation from a POST request.
    /// </summary>
    /// <typeparam name="TModel"></typeparam>
    public class FilePostCommandProcessor<TPostModel, TModel> 
        where TPostModel : class, IValidatable<TModel>
        where TModel: ModelReliefModel, new()
    {
        ApplicationUser                   _user;
        ApiController<TModel>  _controller;

        public FilePostCommandProcessor(ApplicationUser user, ApiController<TModel> controller)
        {
        _user       = user;
        _controller = controller;
        }

        /// <summary>
        /// Create a file from a POST request.
        /// </summary>
        /// <returns></returns>
        async public Task<ObjectResult> Process(TPostModel model, byte[] byteArray)
        {
            try
            {
                // populate model properties (placeholder Name = User.Id)
                var newModel = new TModel() {Name = $"{_user.Id}"};
                newModel.User = _user;
            
                // add to repository
                _controller.DBContext.Set<TModel>().Add(newModel);

                // commit; force Id to be assigned immediately
                _controller.DBContext.SaveChanges();

                // write file : file name = newly-created model Id
                var storeUsers  = _controller.ConfigurationProvider.GetSetting(ResourcePaths.StoreUsers);
                var modelFolder = _controller.ConfigurationProvider.GetSetting(($"{ResourcePaths.ModelFolders}:{typeof(TModel).Name}"));
                string modelPath = $"{storeUsers}{_user.Id}/{modelFolder}/{newModel.Id}/";
                string modelName = $"{newModel.Id}";

                string fileName = $"{_controller.HostingEnvironment.WebRootPath}{modelPath}{modelName}";
                await Files.WriteFileFromByteArray(fileName, byteArray);

                // Return the model URI in the HTTP Response Location Header
                //  XMLHttpRequest.getResponseHeader('Location') :  http://localhost:60655/api/v1/meshes/10
                //  XMLHttpRequest.responseText = (JSON) { id : 10 }
                string responseUrl = _controller.Url.RouteUrl( new {id = newModel.Id});
                Uri responseUrlAbsolute = new Uri($"{_controller.Request.Scheme}://{_controller.Request.Host}{responseUrl}");
                 
                return _controller.Created(responseUrlAbsolute, new {id = newModel.Id});
            }
            catch (Exception)
            {
                return model.ErrorResult(_controller, httpStatusCode: StatusCodes.Status500InternalServerError, apiStatusCode : (int) ApiStatusCode.FileCreation, developerMessage : $"An error occurred creating the file resource {typeof(TModel).Name}.");
            }
        }
    }
}
