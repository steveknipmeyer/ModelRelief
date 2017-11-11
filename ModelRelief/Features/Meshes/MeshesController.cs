// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Database;
using ModelRelief.Domain;
using System.Linq;
using System.Threading.Tasks;
using MediatR;

namespace ModelRelief.Features.Meshes
{
    public class MeshesController : Controller
    {
        private readonly IMediator _mediator;

        public MeshesController(IMediator mediator)
        {
            this._mediator = mediator;
        }


        public async Task<IActionResult> Index (Index.Query query)
        {
            var model = await _mediator.Send (query);

            return View(model);
        }
    }
}
