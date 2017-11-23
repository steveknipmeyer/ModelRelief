// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using System.Collections.Generic;
using MediatR;
using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ModelRelief.Api.V2.Shared.Rest;
using ModelRelief.Database;
using ModelRelief;
using Microsoft.AspNetCore.Mvc;

namespace ModelRelief.Api.V2.Meshes
{
    /// <summary>
    /// Represents a controller to handle Mesh API requests.
    /// </summary>
    // WIP How are API controllers authorized?
    // [Authorize]
    [Area("ApiV2")]
    [Route ("api/v2/[controller]")]        
    public class MeshesController : RestController<Domain.Mesh, Dto.Mesh, Dto.Mesh, Dto.Mesh>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        public MeshesController(ModelReliefDbContext dbContext, IMapper mapper, IMediator mediator)
            : base(dbContext, mapper, mediator)
        {
        }
    }
}
 