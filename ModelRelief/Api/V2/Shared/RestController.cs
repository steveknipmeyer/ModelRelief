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
using ModelRelief.Api.V2.Shared.Rest;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Dto;
using ModelRelief.Utility;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ModelRelief.Api.V2.Shared
{
    public abstract class RestController<TEntity, TGetModel, TSingleGetModel, TPostModel, TPostFile> : ApiController<TEntity>
        where TEntity         : ModelReliefModel
        where TGetModel       : IGetModel           
        where TSingleGetModel : IGetModel
        where TPostModel      : class               // WIP Should TPostModel implement a particular interface?
        where TPostFile       : class, new()        // WIP Should TPostFile implement a particular interface?
    {
        public RestControllerOptions RestControllerOptions { get; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="logger">ILogger.</param>
        /// <param name="mapper">IMapper.</param>
        /// <param name="mediator">IMediator.</param>
        /// <param name="userManager">UserManager.</param>
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <remarks>Defaults to use paging.</remarks>
        protected RestController(ModelReliefDbContext dbContext, ILogger<TEntity> logger, IMapper mapper, IMediator mediator, UserManager<ApplicationUser> userManager, IHostingEnvironment hostingEnvironment, Services.IConfigurationProvider  configurationProvider)
            : this(dbContext, logger, mapper, mediator, userManager, hostingEnvironment, configurationProvider, new RestControllerOptions {UsePaging = true}) {}

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="logger">ILogger.</param>
        /// <param name="mapper">IMapper.</param>
        /// <param name="mediator">IMediator.</param>
        /// <param name="userManager">UserManager.</param>
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="restControllerOptions">Options for paging, etc.</param>
        protected RestController(ModelReliefDbContext dbContext, ILogger<TEntity> logger, IMapper mapper, IMediator mediator, UserManager<ApplicationUser> userManager, IHostingEnvironment hostingEnvironment, Services.IConfigurationProvider  configurationProvider, RestControllerOptions restControllerOptions )
            : base(dbContext, logger, mapper, mediator, userManager, hostingEnvironment, configurationProvider) 
        {
            RestControllerOptions = restControllerOptions;
        }
        
        [HttpGet("{id:int}")]
        public virtual Task<IActionResult> Get(int id) 
        {
            return HandleRequestAsync(new GetSingleRequest<TEntity, TGetModel> {
                Id = id
            });
        }

        [HttpGet("")]
        public virtual Task<IActionResult> Get([FromQuery] GetRequest getRequest)
        {
            getRequest = getRequest ?? new GetRequest();
            return HandleRequestAsync(new GetListRequest<TEntity, TGetModel> 
            {
                UrlHelperContainer  = this,

                PageNumber          = getRequest.PageNumber,
                NumberOfRecords     = getRequest.NumberOfRecords,
                OrderBy             = getRequest.OrderBy,
                Ascending           = getRequest.Ascending,

                UsePaging           = RestControllerOptions.UsePaging,
            });
        }

        [HttpPost]
        public virtual async Task<IActionResult> Post([FromBody] TPostModel postRequest)
        {
            var result =  await HandleRequestAsync(new PostAddRequest<TEntity, TPostModel, TGetModel> 
            {
                NewModel = postRequest
            });

            // Return the model URI in the HTTP Response Location Header
            // XMLHttpRequest.getResponseHeader('Location') :  http://localhost:60655/api/v1/meshes/10
            // XMLHttpRequest.responseText = (JSON) { id : 10 }
            if (result is OkObjectResult)
            {
                var newModel = (TGetModel)((OkObjectResult) result).Value;
                string responseUrl = $"{Url.RouteUrl( new {})}/{newModel.Id}";
                Uri responseUrlAbsolute = new Uri($"{Request.Scheme}://{Request.Host}{responseUrl}");
                Response.Headers["Location"] = responseUrlAbsolute.AbsoluteUri;
            }

            return result;
        }

        [HttpPost]
        [Consumes("application/octet-stream")]
        [DisableRequestSizeLimit]
        public virtual async Task<IActionResult> PostFile()
        { 
            // construct from request body
            var postFile = new PostFile { Raw = Files.ReadToEnd(Request.Body) };

            var result =  await HandleRequestAsync(new PostFileRequest<TEntity, TGetModel> 
            {
                NewFile = postFile
            });

            // Return the model URI in the HTTP Response Location Header
            // XMLHttpRequest.getResponseHeader('Location') :  http://localhost:60655/api/v1/meshes/10
            // XMLHttpRequest.responseText = (JSON) { id : 10 }
            if (result is OkObjectResult)
            {
                var newModel = (TGetModel)((OkObjectResult) result).Value;
                string responseUrl = $"{Url.RouteUrl( new {})}/{newModel.Id}";
                Uri responseUrlAbsolute = new Uri($"{Request.Scheme}://{Request.Host}{responseUrl}");
                Response.Headers["Location"] = responseUrlAbsolute.AbsoluteUri;
            }

            return result;
        }

        [HttpPut("{id:int}")]
        public virtual Task<IActionResult> Put(int id, [FromBody] Dictionary<string, object> data) 
        {
            return HandleRequestAsync (new PutRequest<TEntity, TGetModel>
            { 
            Id = id, 
            Parameters = data,
            DbContext = DbContext
            });
        }

        [HttpDelete("{id:int}")]
        public virtual Task<IActionResult> Delete(int id) 
        {
            return HandleRequestAsync(new DeleteRequest<TEntity> 
            {
                Id = id
            });
        }
    }
}