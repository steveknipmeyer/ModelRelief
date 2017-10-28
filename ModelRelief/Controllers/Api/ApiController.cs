﻿// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ModelRelief.Models;
using ModelRelief.Services;

namespace ModelRelief.Controllers.Api
{
    // [Authorize]
    [Area("api")]
    [Route ("api/[controller]")]        
    public class ApiController<TModel>: Controller
        where TModel : ModelReliefModel
    {
        public IHostingEnvironment              HostingEnvironment { get; set; }
        public UserManager<ApplicationUser>                UserManager { get; set; }
        public IModelProvider<TModel>           ModelProvider { get; set; }
        public ILogger<TModel>                  Logger { get; set; }
        public Services.IConfigurationProvider  ConfigurationProvider { get; set; }
        public IMapper                          Mapper { get; set; }

        public ApiController (IHostingEnvironment hostingEnvironment, UserManager<ApplicationUser> userManager, IModelProvider<TModel> modelProvider, ILogger<TModel> logger, Services.IConfigurationProvider configurationProvider, IMapper mapper)
        {
            HostingEnvironment     = hostingEnvironment;
            UserManager            = userManager;
            ModelProvider          = modelProvider;
            Logger                 = logger;
            ConfigurationProvider  = configurationProvider;
            Mapper                 = mapper;
        }
    }        
}
