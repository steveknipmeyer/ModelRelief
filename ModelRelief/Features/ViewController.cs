// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Api.V2.Shared.Rest;
using ModelRelief.Database;
using ModelRelief.Domain;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ModelRelief.Features
{
    public abstract class ViewController<TEntity, TGetModel, TSingleGetModel, TPostModel> : UxController
        where TEntity         : ModelReliefModel
        where TGetModel       : class, IGetModel           
        where TSingleGetModel : IGetModel
        where TPostModel      : class               
    {
        public ViewControllerOptions ViewControllerOptions { get; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        /// <remarks>Defaults to use paging.</remarks>
        protected ViewController(ModelReliefDbContext dbContext, IMapper mapper, IMediator mediator)
            : this(dbContext, mapper, mediator, new ViewControllerOptions {UsePaging = true}) {}

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        /// <param name="viewControllerOptions">Options for paging, etc.</param>
        protected ViewController(ModelReliefDbContext dbContext, IMapper mapper, IMediator mediator, ViewControllerOptions viewControllerOptions)
            : base(dbContext, mapper, mediator) 
        {
            ViewControllerOptions = viewControllerOptions;
        }

        /// <summary>
        /// Action handler for a Details page.
        /// </summary>
        /// <param name="id">Model Id.</param>
        /// <returns>Details page.</returns>
        public virtual async Task<IActionResult> Details(int id) 
        {
            var model = await HandleRequestAsync(new GetSingleRequest<TEntity, TGetModel> 
            {
                Id = id
            });

            return View(model);
        }

        /// <summary>
        /// Action handler for an Index page.
        /// Returns a collection of models.
        /// </summary>
        /// <param name="getRequest">Request with paging options such as PageNumber, PageSize, etc.</param>
        /// <returns>Index page.</returns>
        public virtual async Task<IActionResult> Index([FromQuery] GetRequest getRequest)
        {
            getRequest = getRequest ?? new GetRequest();
            var pagedResults = await HandleRequestAsync(new GetListRequest<TEntity, TGetModel> 
            {
               UrlHelperContainer  = this,
               
                PageNumber          = getRequest.PageNumber,
                NumberOfRecords     = getRequest.NumberOfRecords,
                OrderBy             = getRequest.OrderBy,
                Ascending           = getRequest.Ascending,

                UsePaging           = ViewControllerOptions.UsePaging,
            });

            var modelCollection = ((PagedResults<TGetModel>) pagedResults).Results;
            return View(modelCollection);
        }

        /// <summary>
        /// Action handler for a Delete confirmation page.
        /// </summary>
        /// <param name="id">Model Id.</param>
        /// <returns>Delete confirmation page.</returns>
        public virtual async Task<IActionResult> Delete(int id)
        {
            var model = await HandleRequestAsync(new GetSingleRequest<TEntity, TGetModel> 
            {
                Id = id
            });

            return View(model);
        }

        /// <summary>
        /// Action handler for a Delete operation.
        /// </summary>
        /// <param name="id">Model Id to delete.</param>
        /// <returns>Index page.</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public virtual async Task<IActionResult> DeleteConfirmed(int id)
        {
            var result = await HandleRequestAsync(new DeleteRequest<TEntity> 
            {
                Id = id
            });

            return this.RedirectToAction(nameof(Index));
        }

        /// <summary>
        /// Action handler for Create Get.
        /// </summary>
        /// <returns>Create page.</returns>
        [HttpGet]
        public virtual ActionResult Create()
        {
            InitializeViewControls();
            return View();
        }

        /// <summary>
        /// Action handler for a Create request.
        /// </summary>
        /// <param name="postRequest">Model to create.</param>
        /// <returns>Index page.</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public virtual async Task<IActionResult> Create(TPostModel postRequest)
        {
            var newModel = await HandleRequestAsync(new PostRequest<TEntity, TPostModel, TGetModel> 
            {
                NewEntity = postRequest
            });

            // validation failed; return to View
            if (newModel == null)
                { 
                InitializeViewControls(Mapper.Map<TGetModel> (postRequest));
                return View(postRequest);
                }

            return this.RedirectToAction(nameof(Index));
        }

        /// <summary>
        /// Action handler for an Edit Get.
        /// </summary>
        /// <param name="id">Model Id to edit.</param>
        /// <returns>Edit page.</returns>
        [HttpGet]
        public virtual async Task<IActionResult> Edit(int id)
        {
            var model = await HandleRequestAsync(new GetSingleRequest<TEntity, TGetModel> 
            {
                Id = id
            });

            InitializeViewControls((TGetModel) model);
            return View(model);
        }

        /// <summary>
        /// Action handler for an Edit request.
        /// </summary>
        /// <param name="postRequest">Edited model to update.</param>
        /// <returns>Index page.</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public virtual async Task<IActionResult> Edit(TPostModel postRequest)
        {
            var model = await HandleRequestAsync(new PostRequest<TEntity, TPostModel, TGetModel> 
            {
                NewEntity = postRequest
            });

            // validation failed; return to View
            if (model == null)
                { 
                InitializeViewControls(Mapper.Map<TGetModel> (postRequest));
                return View(postRequest);
                }

            return this.RedirectToAction(nameof(Index));
        }

        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="projectId">Project Id to select</param>
        protected virtual void InitializeViewControls(TGetModel model = null)
        {
        }
    }
}