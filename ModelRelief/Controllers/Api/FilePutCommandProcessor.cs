// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Infrastructure;
using ModelRelief.Models;
using ModelRelief.Services;
using Serilog;
using System;
using System.Threading.Tasks;

namespace ModelRelief.Controllers.Api
{
    /// <summary>
    /// Handles a file update from a PUT request.
    /// </summary>
    /// <typeparam name="TModel"></typeparam>
    public class FilePutCommandProcessor<TPutModel, TModel> 
        where TPutModel : class, IValidatable<TModel>
        where TModel: ModelReliefModel, IFileResource, new()
    {
        User                    _user;
        ApiController<TModel>   _controller;

        public FilePutCommandProcessor(User user, ApiController<TModel> controller)
        {
        _user       = user;
        _controller = controller;
        }

        /// <summary>
        /// Handles resouce update from a PUT request.
        /// </summary>
        /// <returns>Created HttpStatus</returns>
        public async Task<ObjectResult> Process(int id, TPutModel putModel)
        {
            try
            {

                // find existing model
                var model = _controller.ModelProvider.Find(id);

                // update properties from incoming request
                Mapper.Map<TPutModel, TModel>(putModel, model);

                // construct final file name from PUT request
                var storeUsers  = _controller.ConfigurationProvider.GetSetting(ResourcePaths.StoreUsers);
                var modelFolder = _controller.ConfigurationProvider.GetSetting($"{ResourcePaths.ModelFolders}:{typeof(TModel).Name}");
                string filePath = $"{storeUsers}{_user.Id}/{modelFolder}/{id}/";
                string finalFileName = $"{_controller.HostingEnvironment.WebRootPath}{filePath}{model.Name}";
                model.Path = finalFileName;

                // update repository
                _controller.ModelProvider.Update(model);

                // now rename temporary file to match the final name
                string placeholderFileName = $"{_controller.HostingEnvironment.WebRootPath}{filePath}{id}.obj";
                System.IO.File.Move(placeholderFileName, finalFileName);

                Log.Information("File PUT {@TModel}", putModel);

                return await Task.FromResult<ObjectResult>(_controller.Ok(""));
            }
            catch (Exception)
            {
                return putModel.ErrorResult(_controller, httpStatusCode: StatusCodes.Status500InternalServerError, apiStatusCode : (int) ApiStatusCode.FileCreation, developerMessage : $"An error occurred updating the file resource {typeof(TModel).FullName}.");
            }
        }
    }
}
