// -----------------------------------------------------------------------
// <copyright file="RestFileModelController.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared
{
    using System.Threading.Tasks;
    using MediatR;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
    using ModelRelief.Utility;

    public abstract class RestFileModelController<TEntity, TGetModel, TRequestModel> : RestController<TEntity, TGetModel, TRequestModel>
        where TEntity         : DomainModel
        where TGetModel       : IModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="RestFileModelController{TEntity, TGetModel, TRequestModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mediator">IMediator.</param>
        /// <remarks>Defaults to use paging.</remarks>
        protected RestFileModelController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMediator mediator)
            : base(dbContext, loggerFactory, mediator, new RestControllerOptions { UsePaging = true })
        {
        }

        #region Get
        /// <summary>
        ///  Get a file of a given type.
        /// </summary>
        /// <param name="id">Model Id.</param>
        /// <param name="fileQueryParameters">File query parameters.</param>
        [HttpGet("{id:int}/file")]
        [DisableRequestSizeLimit]
        public virtual async Task<IActionResult> File(int id, [FromQuery] GetFileQueryParameters fileQueryParameters)
        {
            return await GetFileByType(id, GetFileType.Backing, fileQueryParameters);
        }

        /// <summary>
        /// Get the preview image for a file.
        /// </summary>
        /// <param name="id">Model Id.</param>
        [HttpGet("{id:int}/preview")]
        [DisableRequestSizeLimit]
        public virtual async Task<IActionResult> Preview(int id)
        {
            return await GetFileByType(id, GetFileType.Preview, new GetFileQueryParameters { Extension = "png" });
        }

        /// <summary>
        ///  Helper to get a specific file type.
        /// </summary>
        /// <param name="id">Model Id.</param>
        /// <param name="fileType">Type of file.</param>
        /// <param name="fileQueryParameters">File query parameters.</param>
        /// <returns></returns>
        private async Task<IActionResult> GetFileByType(int id, GetFileType fileType, GetFileQueryParameters fileQueryParameters = null)
        {
            var result = await HandleRequestAsync(new GetFileRequest<TEntity>
            {
                User = User,
                Id = id,
                FileType = fileType,

                // (optional) query parameters
                QueryParameters = fileQueryParameters,
            });
            var okObjectResult = result as OkObjectResult;
            if (okObjectResult == null)
                return result;

            var fileContentResult = okObjectResult.Value as FileContentResult;
            return fileContentResult;
        }
        #endregion

        #region Create
        /// <summary>
        /// Action method to create a file that is associated with a model.
        /// </summary>
        /// <param name="fileQueryParameters">File query parameters.</param>
        /// <returns>TGetModel of updated model.</returns>
        [HttpPost("{id:int}/file")]
        [Consumes("application/octet-stream")]
        [DisableRequestSizeLimit]
        public virtual async Task<IActionResult> PostFile([FromQuery] PostFileQueryParameters fileQueryParameters)
        {
            // POST file requires an existing model
            var modelId = System.Convert.ToInt32(this.RouteData.Values["id"]);
            var model = await FindModelById(modelId);

            // construct from request body
            var raw = await Files.ReadToEnd(Request.Body);
            raw = fileQueryParameters.Compression ? Files.Decompress(raw) : raw;
            var postFile = new PostFile
            {
                Name = model.Name,
                Raw = raw,
            };
            var result = await HandleRequestAsync(new PostFileRequest<TEntity, TGetModel>
            {
                User = User,
                Id = modelId,
                NewFile = postFile,
            });

            return PostCreatedResult(result, postFile: true);
        }

        /// <summary>
        /// Action method to update a file in its entirety that is associated with a model.
        /// </summary>
        /// <param name="fileQueryParameters">File query parameters.</param>
        /// <returns>TGetModel of updated model.</returns>
        [HttpPut("{id:int}/file")]
        [Consumes("application/octet-stream")]
        [DisableRequestSizeLimit]
        public virtual async Task<IActionResult> PutFile([FromQuery] PostFileQueryParameters fileQueryParameters)
        {
            return await PostFile(fileQueryParameters);
        }

        /// <summary>
        /// Action method to create a preview that is associated with a model.
        /// </summary>
        /// <returns>TGetModel of updated model.</returns>
        [HttpPost("{id:int}/preview")]
        [Consumes("application/octet-stream")]
        [DisableRequestSizeLimit]
        public virtual async Task<IActionResult> PostPreview()
        {
            // POST preview requires an existing model
            var modelId = System.Convert.ToInt32(this.RouteData.Values["id"]);
            var model = await FindModelById(modelId);

            // construct from request body
            var postPreview = new PostPreview
            {
                Name = model.Name,
                Raw = await Files.ReadToEnd(Request.Body),
            };

            var result = await HandleRequestAsync(new PostPreviewRequest<TEntity, TGetModel>
            {
                User = User,
                Id = modelId,
                NewPreview = postPreview,
            });

            return PostCreatedResult(result, postFile: true);
        }
#endregion
    }
}