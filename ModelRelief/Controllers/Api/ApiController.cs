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
    public class ApiController<TResource>: Controller
        where TResource : ModelReliefEntity
    {
        public IHostingEnvironment             HostingEnvironment { get; set; }
        public UserManager<User>               UserManager { get; set; }
        public IResourceProvider<TResource>    ResourceProvider { get; set; }
        public ILogger<MeshesController>       Logger { get; set; }
        public Services.IConfigurationProvider ConfigurationProvider { get; set; }
        public IMapper                         Mapper { get; set; }

        public ApiController (IHostingEnvironment hostingEnvironment, UserManager<User> userManager, IResourceProvider<TResource> resourceProvider, ILogger<MeshesController> logger, Services.IConfigurationProvider configurationProvider, IMapper mapper)
        {
            HostingEnvironment     = hostingEnvironment;
            UserManager            = userManager;
            ResourceProvider       = resourceProvider;
            Logger                 = logger;
            ConfigurationProvider  = configurationProvider;
            Mapper                 = mapper;
        }
    }        
}
