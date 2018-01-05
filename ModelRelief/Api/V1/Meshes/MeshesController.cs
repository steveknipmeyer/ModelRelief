// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

using MediatR;
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
        /// <param name="userManager">UserManager to convert from ClaimsPrincipal to ApplicationUser.</param>
        /// <param name="logger">ILogger.</param>
        /// <param name="mediator">IMediator.</param>
        public MeshesController(ModelReliefDbContext dbContext, UserManager<ApplicationUser> userManager, ILogger<ApiController<Domain.Mesh>> logger, IMediator mediator)
            : base(dbContext, userManager, logger, mediator)
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
 