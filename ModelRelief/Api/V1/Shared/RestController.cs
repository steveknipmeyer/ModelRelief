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
using ModelRelief.Utility;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ModelRelief.Api.V1.Shared
{
    public abstract class RestController<TEntity, TGetModel, TSingleGetModel, TPostModel, TPostFile> : ApiController<TEntity>
        where TEntity         : DomainModel
        where TGetModel       : IIdModel           
        where TSingleGetModel : IIdModel
        where TPostModel      : IIdModel
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
        
        [HttpGet("{id:int}")]
        public virtual async Task<IActionResult> GetSingle(int id) 
        {
            return await HandleRequestAsync(new GetSingleRequest<TEntity, TGetModel> {
                User = User,
                Id = id
            });
        }

        [HttpGet("")]
        public virtual async Task<IActionResult> GetList([FromQuery] GetRequest getRequest)
        {
            getRequest = getRequest ?? new GetRequest();
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

        [HttpPost]
        public virtual async Task<IActionResult> PostAdd([FromBody] TPostModel postRequest)
        {
            var result = await HandleRequestAsync(new PostAddRequest<TEntity, TPostModel, TGetModel>
            {
                User = User,
                NewModel = postRequest
            });

            return PostCreatedResult(result);
        }

        [HttpPost("{id:int}")]
        public virtual async Task<IActionResult> PostUpdate(int id, [FromBody] TPostModel postRequest)
        {
            return await HandleRequestAsync(new PostUpdateRequest<TEntity, TPostModel, TGetModel>
            {
                User = User,
                UpdatedModel = postRequest
            });
        }

        [HttpPost]
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
                NewFile = postFile
            });

            return PostCreatedResult(result);
        }

        [HttpPut("{id:int}")]
        public virtual async Task<IActionResult> Put(int id, [FromBody] Dictionary<string, object> data) 
        {
            return await HandleRequestAsync (new PutRequest<TEntity, TGetModel>
            { 
            User = User,
            Id = id, 
            Parameters = data,
            DbContext = DbContext
            });
        }

        [HttpDelete("{id:int}")]
        public virtual async Task<IActionResult> Delete(int id) 
        {
            return await HandleRequestAsync(new DeleteRequest<TEntity> 
            {
                User = User,
                Id = id
            });
        }

        /// <summary>
        /// Gets the Uri of a newly-created resource.
        /// </summary>
        /// <param name="okResult"></param>
        private Uri GetCreatedUri(OkObjectResult okResult)
        {
            var newModel = (TGetModel)((OkObjectResult)okResult).Value;
            string responseUrl = $"{Url.RouteUrl(new { })}/{newModel.Id}";
            Uri responseUrlAbsolute = new Uri($"{Request.Scheme}://{Request.Host}{responseUrl}");

            return responseUrlAbsolute;
        }

        /// <summary>
        /// Conditions a POST result into the appropriate HTTP response.
        /// </summary>
        /// <param name="result">IActionResult from processing.</param>
        /// <returns>Created(201) is successful; otherwise raw result (typically ApiResult)</returns>
        private IActionResult PostCreatedResult(IActionResult result)
        {
            // return ApiErrorResult if not OK; all successful requests return OK 
            if (!(result is OkObjectResult))
                return result;

            var okResult = result as OkObjectResult;
            var createdResult = Created(GetCreatedUri(okResult), okResult.Value);
            return createdResult;
        }
    }
}