// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;
using ModelRelief.Api.V2.Shared.Rest;

namespace ModelRelief.Api.V2.Shared
{
    public abstract class RestController<TEntity, TGetModel, TSingleGetModel, TPostModel> : ApiController
        where TEntity         : ModelReliefModel
        where TGetModel       : IGetModel           
        where TSingleGetModel : IGetModel
        where TPostModel      : class               // WIP Should TPostModel implement a particular interface?
    {
        public RestControllerOptions RestControllerOptions { get; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        /// <remarks>Defaults to use paging.</remarks>
        protected RestController(ModelReliefDbContext dbContext, IMapper mapper, IMediator mediator)
            : this(dbContext, mapper, mediator, new RestControllerOptions {UsePaging = true}) {}

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        /// <param name="restControllerOptions">Options for paging, etc.</param>
        protected RestController(ModelReliefDbContext dbContext, IMapper mapper, IMediator mediator, RestControllerOptions restControllerOptions)
            : base(dbContext, mapper, mediator) 
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
        public virtual Task<IActionResult> Post([FromBody] TPostModel postRequest)
        {
            return HandleRequestAsync(new PostAddRequest<TEntity, TPostModel, TGetModel> 
            {
                NewModel = postRequest
            });
        }

        [HttpPut("{id:int}")]
        public virtual Task<IActionResult> Put(int id, [FromBody] Dictionary<string, object> data) 
        {
            return HandleRequestAsync(new PutRequest<TEntity, TGetModel> 
            {
                Parameters = data,
                Id = id
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