﻿// -----------------------------------------------------------------------
// <copyright file="ModelsController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Models
{
    using MediatR;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared;
    using ModelRelief.Database;

    /// <summary>
    /// Represents a controller to handle Model3d API requests.
    /// </summary>
    [Route("api/v1/[controller]")]
    public class ModelsController : RestController<Domain.Model3d, Dto.Model3d, Dto.Model3d, Dto.PostFile>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ModelsController"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mediator">IMediator.</param>
        public ModelsController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMediator mediator)
            : base(dbContext, loggerFactory, mediator)
        {
        }
    }
}
