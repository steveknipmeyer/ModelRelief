// -----------------------------------------------------------------------
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
    public class MeshesController : RestController<Domain.Mesh, Dto.Mesh, Dto.Mesh, Dto.PostFile>
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
#if false
        /// <summary>
        /// Action method to create a file that is associated with a model.
        /// </summary>
        /// <returns>TGetModel of newly-created model.</returns>
        [HttpPost("{id:int}/file")]
        [Consumes("application/octet-stream")]
        [DisableRequestSizeLimit]
        public override async Task<IActionResult> PostFile()
        {
            var errorResult = new ApiErrorResult
            (
                this,
                HttpStatusCode.BadRequest,
                ApiErrorCode.FileCreation,
                "Meshes cannot be created through POST.  Create a Mesh by synchronizing the object with its dependents."
            );
            return await Task.FromResult(errorResult.ObjectResult());
        }
#endif
    }
}
