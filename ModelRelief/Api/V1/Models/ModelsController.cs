﻿// -----------------------------------------------------------------------
// <copyright file="ModelsController.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Models
{
    using System;
    using System.Threading.Tasks;
    using MediatR;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;

    /// <summary>
    /// Represents a controller to handle Model3d API requests.
    /// </summary>
    [Route("api/v1/[controller]")]
    public class ModelsController : RestFileModelController<Domain.Model3d, Dto.Model3d, Dto.Model3d>
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

        /// <summary>
        /// Action method for a PostRequest to create a new model.
        /// </summary>
        /// <param name="postRequest">TRequestModel of model to create. Does not contain a model Id.</param>
        /// <returns>TGetModel of the newly-created model.</returns>
        [HttpPost("form")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Form([FromForm] Dto.Model3d postRequest)
        {
            var result = await HandleRequestAsync(new PostFormRequest<Domain.Model3d, Dto.Model3d, Dto.Model3d>
            {
                User = User,
                FileModel = postRequest,
            });

            return PostCreatedResult(result);
        }
    }
}
