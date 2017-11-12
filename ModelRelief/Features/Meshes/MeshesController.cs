// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ModelRelief.Services;
using System.Threading.Tasks;

namespace ModelRelief.Features.Meshes
{
    [Authorize]
    public class MeshesController : Controller
    {
        IHostingEnvironment         _hostingEnvironment;
        IModelsProvider             _modelsProvider;
        ILogger<MeshesController>   _logger;
        IMediator                   _mediator;
        IMapper                     _mapper;

        public MeshesController(IHostingEnvironment hostingEnvironment, IModelsProvider modelsrovider, ILogger<MeshesController> logger, IMediator mediator, IMapper mapper)
        {
            _hostingEnvironment = hostingEnvironment;
            _modelsProvider     = modelsrovider;
            _logger             = logger;
            _mediator           = mediator;
            _mapper             = mapper;
        }

        public async Task<IActionResult> Index (Index.Query query)
        {
            var model = await _mediator.Send (query);

            return View(model);
        }

       public async Task<IActionResult> Details (Details.Query query)
        {
            var model = await _mediator.Send (query);

            return View(model);
        }
    }
}
