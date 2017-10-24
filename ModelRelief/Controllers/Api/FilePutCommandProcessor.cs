// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Models;
using ModelRelief.Services;
using ModelRelief.Utility;
using Serilog;
using System;
using System.Threading.Tasks;

namespace ModelRelief.Controllers.Api
{
    /// <summary>
    /// Handles resouce update from a PUT request.
    /// </summary>
    /// <typeparam name="TResource"></typeparam>
    public class FilePutCommandProcessor<TPutResource, TResource> 
        where TPutResource : class
        where TResource: ModelReliefEntity, IFileResource, new() 
    {
        User                     _user;
        ApiController<TResource> _controller;

        public FilePutCommandProcessor(User user, ApiController<TResource> controller)
        {
        _user       = user;
        _controller = controller;
        }

        /// <summary>
        /// Handles resouce update from a PUT request.
        /// </summary>
        /// <returns>Created HttpStatus</returns>
        public async Task<ObjectResult> Process(int id, TPutResource putResource)
        {
            // find existing resource
            var resource = _controller.ResourceProvider.Find(id);

            // update properties from incoming request
            Mapper.Map<TPutResource, TResource>(putResource, resource);

            // construct final file name from PUT request
            var storeUsers  = _controller.ConfigurationProvider.GetSetting(ResourcePaths.StoreUsers);
            string resourcePath = $"{storeUsers}{_user.Id}/meshes/{id}/";
            string finalFileName = $"{_controller.HostingEnvironment.WebRootPath}{resourcePath}{resource.Name}";
            resource.Path = finalFileName;

            _controller.ResourceProvider.Update(resource);

            // now rename temporary file to match the final name
            string placeholderFileName = $"{_controller.HostingEnvironment.WebRootPath}{resourcePath}{id}.obj";
            System.IO.File.Move(placeholderFileName, finalFileName);

            Log.Information("File PUT {@TResource}", putResource);

            return _controller.Ok("");

        }
    }
}
