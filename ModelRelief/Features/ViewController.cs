// -----------------------------------------------------------------------
// <copyright file="ViewController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features
{
    using System.Threading.Tasks;
    using AutoMapper;
    using MediatR;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Dto;

    public abstract class ViewController<TEntity, TGetModel, TSingleGetModel, TRequestModel> : UxController
        where TEntity         : DomainModel
        where TGetModel       : class, IModel, new()            // class to allow default null parameter in InitializeViewControls
        where TSingleGetModel : IModel
    {
        public ViewControllerOptions ViewControllerOptions { get; }
        public new ILogger Logger { get; }                // base class Logger category is UxController

        /// <summary>
        /// Initializes a new instance of the <see cref="ViewController{TEntity, TGetModel, TSingleGetModel, TRequestModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        /// <remarks>Defaults to use paging.</remarks>
        protected ViewController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMapper mapper, IMediator mediator)
            : this(dbContext, loggerFactory, mapper, mediator, new ViewControllerOptions { UsePaging = true })
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ViewController{TEntity, TGetModel, TSingleGetModel, TRequestModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        /// <param name="viewControllerOptions">Options for paging, etc.</param>
        protected ViewController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMapper mapper, IMediator mediator, ViewControllerOptions viewControllerOptions)
            : base(dbContext, loggerFactory, mapper, mediator)
        {
            ViewControllerOptions = viewControllerOptions;
            Logger                = loggerFactory.CreateLogger(typeof(ViewController<TEntity, TGetModel, TSingleGetModel, TRequestModel>).Name);
        }

        #region Get
        /// <summary>
        /// Action handler for an Index page.
        /// Returns a collection of models.
        /// </summary>
        /// <param name="pagedQueryParameters">Parameters for returning a collection of models including page number, size.</param>
        /// <param name="queryParameters">Query parameters.</param>
        /// <returns>Index page.</returns>
        public virtual async Task<IActionResult> Index([FromQuery] GetPagedQueryParameters pagedQueryParameters, [FromQuery] GetQueryParameters queryParameters)
        {
            pagedQueryParameters = pagedQueryParameters ?? new GetPagedQueryParameters();
            var results = await HandleRequestAsync(new GetQueryRequest<TEntity, TGetModel>
            {
                User = User,
                UrlHelperContainer = this,

                // not implemented in UI
                UsePaging = false,

                // (optional) query parameters
                QueryParameters = queryParameters,
            });

            // N.B. Return value may be PagedResults or a simple Array depending on if UsePaging was active in the request.
            var modelCollection = (results is PagedResults<TGetModel>) ? ((PagedResults<TGetModel>)results).Results : results;

            return View(modelCollection);
        }

        /// <summary>
        /// Action handler for a Details page.
        /// </summary>
        /// <param name="id">Model Id.</param>
        /// <param name="queryParameters">Query parameters.</param>
        /// <returns>Details page.</returns>
        public virtual async Task<IActionResult> Details(int id, [FromQuery] GetQueryParameters queryParameters)
        {
            var model = await HandleRequestAsync(new GetSingleRequest<TEntity, TGetModel>
            {
                User = User,
                Id = id,

                // (optional) query parameters
                QueryParameters = queryParameters,
            }) as TGetModel;

            if (model == null)
                return NotFound();

            model = await ModifyDetailsViewModel(model);
            return View(model);
        }
        #endregion

        #region Create
        /// <summary>
        /// Action handler for Create Get.
        /// </summary>
        /// <returns>Create page.</returns>
        [HttpGet]
        public async virtual Task<ActionResult> Create()
        {
            await InitializeViewControls();
            return View(new TGetModel());
        }

        /// <summary>
        /// Action handler for a Create request.
        /// </summary>
        /// <param name="postRequest">Model to create.</param>
        /// <returns>Create page.</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public virtual async Task<IActionResult> Create(TRequestModel postRequest)
        {
            var newModel = await HandleRequestAsync(new PostRequest<TEntity, TRequestModel, TGetModel>
            {
                User = User,
                NewModel = postRequest,
            });

            // validation failed; return to View
            if (newModel == null)
                {
                await InitializeViewControls(Mapper.Map<TGetModel>(postRequest));
                return View(postRequest);
                }

            return this.RedirectToAction(nameof(Index));
        }
        #endregion

        #region Edit
        /// <summary>
        /// Action handler for an Edit Get.
        /// </summary>
        /// <param name="id">Model Id to edit.</param>
        /// <param name="queryParameters">Query parameters.</param>
        /// <returns>Edit page.</returns>
        [HttpGet]
        public virtual async Task<IActionResult> Edit(int id, [FromQuery] GetQueryParameters queryParameters)
        {
            var model = await HandleRequestAsync(new GetSingleRequest<TEntity, TGetModel>
            {
                User = User,
                Id = id,

                // (optional) query parameters
                QueryParameters = queryParameters,
            });

            if (model == null)
                return NotFound();

            await InitializeViewControls((TGetModel)model);

            // clear ModelState to prevent query parameters (e.g. partial Name) from binding
            ModelState.Clear();

            return View(model);
        }

        /// <summary>
        /// Action handler for an Edit request.
        /// </summary>
        /// <param name="id">Id of model to edit.</param>
        /// <param name="postRequest">Edited model to update.</param>
        /// <returns>Edit page.</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public virtual async Task<IActionResult> Edit(int id, TRequestModel postRequest)
        {
            var model = await HandleRequestAsync(new PutRequest<TEntity, TRequestModel, TGetModel>
            {
                User = User,
                Id = id,
                UpdatedModel = postRequest,
            });

            // validation failed; return to View
            if (model == null)
                {
                await InitializeViewControls(Mapper.Map<TGetModel>(postRequest));
                return View(postRequest);
                }

            return this.RedirectToAction(nameof(Index));
        }
        #endregion

        #region Delete
        /// <summary>
        /// Action handler for a Delete confirmation page.
        /// </summary>
        /// <param name="id">Model Id.</param>
        /// <returns>Delete confirmation page.</returns>
        public virtual async Task<IActionResult> Delete(int id)
        {
            var model = await HandleRequestAsync(new GetSingleRequest<TEntity, TGetModel>
            {
                User = User,
                Id = id,
            });
            if (model == null)
                return NotFound();

            return View(model);
        }

        /// <summary>
        /// Action handler for a Delete operation.
        /// </summary>
        /// <param name="id">Model Id to delete.</param>
        /// <returns>DeleteConfirmed page.</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public virtual async Task<IActionResult> DeleteConfirmed(int id)
        {
            var result = await HandleRequestAsync(new DeleteRequest<TEntity>
            {
                User = User,
                Id = id,
            });

            return this.RedirectToAction(nameof(Index));
        }
        #endregion

        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="model">Model instance for View.</param>
        protected async virtual Task InitializeViewControls(TGetModel model = null)
        {
            await Task.CompletedTask;
        }

        /// <summary>
        /// Modify the View model before it is presented.
        /// </summary>
        /// <param name="model">Model instance for View.</param>
        protected async virtual Task<TGetModel> ModifyDetailsViewModel(TGetModel model)
        {
            await Task.CompletedTask;
            return model;
        }
    }
}