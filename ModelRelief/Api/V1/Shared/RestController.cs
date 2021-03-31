// -----------------------------------------------------------------------
// <copyright file="RestController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using MediatR;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
    using ModelRelief.Utility;

    public abstract class RestController<TEntity, TGetModel, TRequestModel> : ApiController<TEntity>
        where TEntity         : DomainModel
        where TGetModel       : IModel
    {
        public RestControllerOptions RestControllerOptions { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="RestController{TEntity, TGetModel, TRequestModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mediator">IMediator.</param>
        /// <remarks>Defaults to use paging.</remarks>
        protected RestController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMediator mediator)
            : this(dbContext, loggerFactory, mediator, new RestControllerOptions { UsePaging = true })
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="RestController{TEntity, TGetModel, TRequestModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mediator">IMediator.</param>
        /// <param name="restControllerOptions">Options for paging, etc.</param>
        protected RestController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMediator mediator, RestControllerOptions restControllerOptions)
            : base(dbContext, loggerFactory, mediator)
        {
            RestControllerOptions = restControllerOptions;
        }

        #region Get
        /// <summary>
        /// Action method for GetMultipleRequest.
        /// </summary>
        /// <param name="pagedQueryParameters">Parameters for returning a collection of models including page number, size.</param>
        /// <param name="queryParameters">Query parameters.</param>
        /// <returns>A collection of models in a PagedResult.</returns>
        [HttpGet("")]
        public virtual async Task<IActionResult> GetMultiple([FromQuery] GetPagedQueryParameters pagedQueryParameters, [FromQuery] GetQueryParameters queryParameters)
        {
            pagedQueryParameters = pagedQueryParameters ?? new GetPagedQueryParameters();
            return await HandleRequestAsync(new GetMultipleRequest<TEntity, TGetModel>
            {
                User = User,
                UrlHelperContainer  = this,

                // results presentation
                UsePaging           = RestControllerOptions.UsePaging,

                PageNumber          = pagedQueryParameters.PageNumber,
                NumberOfRecords     = pagedQueryParameters.NumberOfRecords,
                OrderBy             = pagedQueryParameters.OrderBy,
                Ascending           = pagedQueryParameters.Ascending,

                // (optional) query parameters
                QueryParameters     = queryParameters,
            });
        }

        /// <summary>
        /// Action method for GetSingleRequest.
        /// </summary>
        /// <param name="id">Model Id to fetch.</param>
        /// <param name="queryParameters">Query parameters.</param>
        /// <returns>TGetModel of target model.</returns>
        [HttpGet("{id:int}")]
        public virtual async Task<IActionResult> GetSingle(int id, [FromQuery] GetQueryParameters queryParameters)
        {
            return await HandleRequestAsync(new GetSingleRequest<TEntity, TGetModel>
            {
                User = User,
                Id = id,

                // (optional) query parameters
                QueryParameters = queryParameters,
            });
        }

        [HttpGet("{id:int}/file")]
        [DisableRequestSizeLimit]
      //[Produces("application/octet-stream")]
        public virtual async Task<IActionResult> GetFile(int id)
        {
            return await HandleRequestAsync(new GetFileRequest<TEntity>
            {
                User = User,
                Id = id,
            });
        }
        #endregion

        #region Create
        /// <summary>
        /// Action method for a PostRequest to create a new model.
        /// </summary>
        /// <param name="postRequest">TRequestModel of model to create. Does not contain a model Id.</param>
        /// <returns>TGetModel of the newly-created model.</returns>
        [HttpPost]
        public virtual async Task<IActionResult> Post([FromBody] TRequestModel postRequest)
        {
            var result = await HandleRequestAsync(new PostRequest<TEntity, TRequestModel, TGetModel>
            {
                User = User,
                NewModel = postRequest,
            });

            return PostCreatedResult(result);
        }

        /// <summary>
        /// Action method to create a file that is associated with a model.
        /// </summary>
        /// <returns>TGetModel of newly-created model.</returns>
        [HttpPost("{id:int}/file")]
        [Consumes("application/octet-stream")]
        [DisableRequestSizeLimit]
        public virtual async Task<IActionResult> PostFile()
        {
            // POST file requies an existing model
            var modelId = System.Convert.ToInt32(this.RouteData.Values["id"]);
            var model = await FindModelById(modelId);

            // construct from request body
            var postFile = new PostFile
            {
                Name = model.Name,
                Raw = await Files.ReadToEnd(Request.Body),
            };

            var result = await HandleRequestAsync(new PostFileRequest<TEntity, TGetModel>
            {
                User = User,
                Id = modelId,
                NewFile = postFile,
            });

            return PostCreatedResult(result, postFile: true);
        }
        #endregion

        #region Update
        /// <summary>
        /// Action method for Put Request. Updates ALL properties of a model.
        /// </summary>
        /// <param name="id">Id of model to update.</param>
        /// <param name="putRequest">TPost model containing a complete model.</param>
        /// <returns>TGetModel of updated model.</returns>
        [HttpPut("{id:int}")]
        public virtual async Task<IActionResult> Put(int id, [FromBody] TRequestModel putRequest)
        {
            return await HandleRequestAsync(new PutRequest<TEntity, TRequestModel, TGetModel>
            {
                User = User,
                Id = id,
                UpdatedModel = putRequest,
            });
        }

        /// <summary>
        /// Action method to update a file in its entirety that is associated with a model.
        /// </summary>
        /// <returns>TGetModel of updated model.</returns>
        [HttpPut("{id:int}/file")]
        [Consumes("application/octet-stream")]
        [DisableRequestSizeLimit]
        public virtual async Task<IActionResult> PutFile()
        {
            return await PostFile();
        }

        /// <summary>
        /// Action method for PatchRequest. Updates a subset of model properties.
        /// </summary>
        /// <param name="id">Id of model to update.</param>
        /// <param name="data">Dictionary of property key:values.</param>
        /// <returns>TGetModel of update model.</returns>
        [HttpPut("{id:int}/patch")]
        public virtual async Task<IActionResult> PutPatch(int id, [FromBody] Dictionary<string, object> data)
        {
            return await Patch(id, data);
        }

        /// <summary>
        /// Action method for PatchRequest. Updates a subset of model properties.
        /// </summary>
        /// <param name="id">Id of model to update.</param>
        /// <param name="data">Dictionary of property key:values.</param>
        /// <returns>TGetModel of update model.</returns>
        [HttpPatch("{id:int}")]
        public virtual async Task<IActionResult> Patch(int id, [FromBody] Dictionary<string, object> data)
        {
            return await HandleRequestAsync(new PatchRequest<TEntity, TGetModel>
            {
            User = User,
            Id = id,
            Parameters = data,
            DbContext = DbContext,
            });
        }
        #endregion

        #region Delete
        /// <summary>
        /// Action method for DeleteRequest.
        /// </summary>
        /// <param name="id">Id of model to delete.</param>
        /// <returns>Ok if successfully deleted.</returns>
        [HttpDelete("{id:int}")]
        public virtual async Task<IActionResult> Delete(int id)
        {
            return await HandleRequestAsync(new DeleteRequest<TEntity>
            {
                User = User,
                Id = id,
            });
        }
        #endregion

        /// <summary>
        /// Gets the Uri of a newly-created resource.
        /// </summary>
        /// <param name="okResult">OKResult from successful post</param>
        /// <param name="postFile">File resource posted; not metadata</param>
        private Uri GetCreatedUri(OkObjectResult okResult, bool postFile)
        {
            // N.B. Files are posted to a 'file' subresource (e.g. resource/id/file while metadata is posted to the root resource.
            //   Type       Post Endpoint       Created Endpoint
            //   file       resource/id/file    resource/id/file
            //   JSON       resource            resource/id
            // Therefore, the created URL that is returned must be handled differently.
            // For JSON, the new id is appended while for a file the created endpoint is the same as the POST endpoint.

            var newModel = (TGetModel)((OkObjectResult)okResult).Value;
            string subPath = postFile ? string.Empty : $"/{newModel.Id}";
            string createdUrl = $"{this.Request.Path}{subPath}";

            Uri createdUrlAbsolute = new Uri($"{Request.Scheme}://{Request.Host}{createdUrl}");

            return createdUrlAbsolute;
        }

        /// <summary>
        /// Conditions a POST result into the appropriate HTTP response.
        /// </summary>
        /// <param name="result">IActionResult from processing.</param>
        /// <returns>Created(201) is successful; otherwise raw result (typically ApiError)</returns>
        /// <param name="postFile">File resource posted; not metadata</param>
        private IActionResult PostCreatedResult(IActionResult result, bool postFile = false)
        {
            // return ApiError if not OK; all successful requests return OK
            if (!(result is OkObjectResult))
                return result;

            var okResult = result as OkObjectResult;
            var createdResult = Created(GetCreatedUri(okResult, postFile), okResult.Value);
            return createdResult;
        }
    }
}