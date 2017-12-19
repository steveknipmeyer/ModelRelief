// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Dto;
using ModelRelief.Infrastructure;
using ModelRelief.Utility;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ModelRelief.Api.V1.Shared
{
    public abstract class RestController<TEntity, TGetModel, TSingleGetModel, TRequestModel, TPostFile> : ApiController<TEntity>
        where TEntity         : DomainModel
        where TGetModel       : ITGetModel           
        where TSingleGetModel : ITGetModel
        where TPostFile       : class, new()        // WIP Should TPostFile implement a particular interface?
    {
        public RestControllerOptions RestControllerOptions { get; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="userManager">UserManager to convert from ClaimsPrincipal to ApplicationUser.</param>
        /// <param name="logger">ILogger.</param>
        /// <param name="mediator">IMediator.</param>
        /// <remarks>Defaults to use paging.</remarks>
        protected RestController(ModelReliefDbContext dbContext, UserManager<ApplicationUser> userManager, ILogger<TEntity> logger, IMediator mediator)
            : this(dbContext, userManager, logger, mediator, new RestControllerOptions {UsePaging = true}) {}

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="userManager">UserManager to convert from ClaimsPrincipal to ApplicationUser.</param>
        /// <param name="logger">ILogger.</param>
        /// <param name="mediator">IMediator.</param>
        /// <param name="restControllerOptions">Options for paging, etc.</param>
        protected RestController(ModelReliefDbContext dbContext, UserManager<ApplicationUser> userManager, ILogger<TEntity> logger, IMediator mediator, RestControllerOptions restControllerOptions )
            : base(dbContext, userManager, logger, mediator) 
        {
            RestControllerOptions = restControllerOptions;
        }

        #region Get
        /// <summary>
        /// Action method for GetListRequest.
        /// </summary>
        /// <param name="getRequest">Parameters for returning a collection of models including page number, size.</param>
        /// <returns>A collection of models in a PagedResult.</returns>
        [HttpGet("")]
        public virtual async Task<IActionResult> GetList([FromQuery] GetListRequest getRequest)
        {
            getRequest = getRequest ?? new GetListRequest();
            return await HandleRequestAsync(new GetListRequest<TEntity, TGetModel> 
            {
                User = User,
                UrlHelperContainer  = this,

                PageNumber          = getRequest.PageNumber,
                NumberOfRecords     = getRequest.NumberOfRecords,
                OrderBy             = getRequest.OrderBy,
                Ascending           = getRequest.Ascending,

                UsePaging           = RestControllerOptions.UsePaging,
            });
        }
        
        /// <summary>
        /// Action method for GetSingleRequest.
        /// </summary>
        /// <param name="id">Model Id to fetch.</param>
        /// <returns>TGetModel of target model.</returns>
        [HttpGet("{id:int}")]
        public virtual async Task<IActionResult> GetSingle(int id) 
        {
            return await HandleRequestAsync(new GetSingleRequest<TEntity, TGetModel> {
                User = User,
                Id = id
            });
        }

        [HttpGet("{id:int}/file")]
        [DisableRequestSizeLimit]
        public virtual async Task<IActionResult> GetFile(int id)
        {
            return await HandleRequestAsync(new GetFileRequest<TEntity> {
                User = User,
                Id = id
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
                NewModel = postRequest
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
            // construct from request body
            var postFile = new PostFile 
            { 
                Raw = Files.ReadToEnd(Request.Body),
            };

            var result = await HandleRequestAsync(new PostFileRequest<TEntity, TGetModel>
            {
                User = User,
                Id = System.Convert.ToInt32(this.RouteData.Values["id"]),
                NewFile = postFile
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
                UpdatedModel = putRequest
            });
        }

        /// <summary>
        /// Action method to update a file in its entirey that is associated with a model.
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
            return await Patch (id, data);
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
            return await HandleRequestAsync (new PatchRequest<TEntity, TGetModel>
            { 
            User = User,
            Id = id, 
            Parameters = data,
            DbContext = DbContext
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
                Id = id
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
            string subResource = postFile ? "/file" : "";
            string createdUrl = $"{this.Request.Path}/{newModel.Id}{subResource}";

            Uri createdUrlAbsolute = new Uri($"{Request.Scheme}://{Request.Host}{createdUrl}");

            return createdUrlAbsolute;
        }

        /// <summary>
        /// Conditions a POST result into the appropriate HTTP response.
        /// </summary>
        /// <param name="result">IActionResult from processing.</param>
        /// <returns>Created(201) is successful; otherwise raw result (typically ApiResult)</returns>
        /// <param name="postFile">File resource posted; not metadata</param>
        private IActionResult PostCreatedResult(IActionResult result, bool postFile = false)
        {
            // return ApiErrorResult if not OK; all successful requests return OK 
            if (!(result is OkObjectResult))
                return result;

            var okResult = result as OkObjectResult;
            var createdResult = Created(GetCreatedUri(okResult, postFile), okResult.Value);
            return createdResult;
        }
    }
}