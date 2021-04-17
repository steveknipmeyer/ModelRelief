﻿// -----------------------------------------------------------------------
// <copyright file="MeshesController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Meshes
{
    using MediatR;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared;
    using ModelRelief.Database;

    /// <summary>
    /// Represents a controller to handle Mesh API requests.
    /// </summary>
    [Route("api/v1/[controller]")]
    public class MeshesController : RestController<Domain.Mesh, Dto.Mesh, Dto.Mesh>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MeshesController"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mediator">IMediator.</param>
        public MeshesController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMediator mediator)
            : base(dbContext, loggerFactory, mediator)
        {
        }
    }
}
