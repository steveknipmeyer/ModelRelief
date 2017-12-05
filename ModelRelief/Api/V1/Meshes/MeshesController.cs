// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ModelRelief.Api.V1.Shared;
using ModelRelief.Database;
using ModelRelief.Domain;

namespace ModelRelief.Api.V1.Meshes
{
    /// <summary>
    /// Represents a controller to handle Mesh API requests.
    /// </summary>
    [Route ("api/v1/[controller]")]        
    public class MeshesController : RestController<Domain.Mesh, Dto.Mesh, Dto.Mesh, Dto.Mesh, Dto.PostFile>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="logger">ILogger.</param>
        /// <param name="mediator">IMediator.</param>
        public MeshesController(ModelReliefDbContext dbContext, ILogger<Domain.Mesh> logger, IMediator mediator)
            : base(dbContext, logger, mediator)
        {
        }
    }
}
 