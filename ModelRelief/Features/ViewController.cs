// -----------------------------------------------------------------------
// <copyright file="ViewController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
namespace ModelRelief.Features
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using AutoMapper;
    using MediatR;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
    using ModelRelief.Features.Settings;
    using ModelRelief.Utility;

    public abstract class ViewController<TEntity, TGetModel, TRequestModel> : UxController
        where TEntity         : DomainModel
        where TGetModel       : class, IModel, new()            // class to allow default null parameter in InitializeViewControls
    {
        protected ViewControllerOptions ViewControllerOptions { get; }
        protected new ILogger Logger { get; }                     // base class Logger category is UxController
        protected ISettingsManager SettingsManager { get; set; }
        protected IQuery Query { get; set; }
        protected string UserId { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ViewController{TEntity, TGetModel, TRequestModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="settingsManager">Settings manager.</param>
        /// <param name="mediator">IMediator</param>
        /// <param name="query">IQuery</param>
        /// <remarks>Defaults to use paging.</remarks>
        protected ViewController(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            ISettingsManager settingsManager,
            IMediator mediator,
            IQuery query)
            : this(dbContext, loggerFactory, mapper, settingsManager, mediator, query, new ViewControllerOptions { UsePaging = true })
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ViewController{TEntity, TGetModel, TRequestModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactory.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="settingsManager">Settings manager.</param>
        /// <param name="mediator">IMediator</param>
        /// <param name="query">IQuery</param>
        /// <param name="viewControllerOptions">Options for paging, etc.</param>
        protected ViewController(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            ISettingsManager settingsManager,
            IMediator mediator,
            IQuery query,
            ViewControllerOptions viewControllerOptions)
            : base(dbContext, loggerFactory, mapper, mediator)
        {
            ViewControllerOptions = viewControllerOptions;
            Logger                = loggerFactory.CreateLogger(typeof(ViewController<TEntity, TGetModel, TRequestModel>).Name);
            SettingsManager       = settingsManager ?? throw new System.ArgumentNullException(nameof(settingsManager));
            Query                 = query ?? throw new System.ArgumentNullException(nameof(query));
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
            var results = await HandleRequestAsync(new GetMultipleRequest<TEntity, TGetModel>
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

            modelCollection = await FilterModelCollectionByActiveProject(modelCollection as IEnumerable<TGetModel>);

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

            return View(model);
        }
        #endregion

        #region Create
        /// <summary>
        /// Action handler for Create Get.
        /// </summary>
        /// <returns>Create page.</returns>
        [HttpGet]
        public virtual async Task<ActionResult> Create()
        {
            await InitializeViewControlsAsync();
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

            // request failed; return to View
            if (newModel == null)
                {
                await InitializeViewControlsAsync(Mapper.Map<TGetModel>(postRequest));
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

            await InitializeViewControlsAsync((TGetModel)model);

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

            // request failed; return to View
            if (model == null)
                {
                await InitializeViewControlsAsync(Mapper.Map<TGetModel>(postRequest));
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
        /// Initialize the user session settings.
        /// </summary>
        protected async Task InitializeSessionAsync()
        {
            var applicationUser = await IdentityUtility.FindApplicationUserAsync(User);
            UserId = applicationUser?.Id ?? string.Empty;

            await SettingsManager.InitializeUserSessionAsync(User);
        }

        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="model">Model instance for View.</param>
        protected async virtual Task InitializeViewControlsAsync(TGetModel model = null)
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

        /// <summary>
        /// Create a SelectList from an enum.
        /// Note: None is skipped.
        /// </summary>
        /// <typeparam name="TEnum">The enum type of the list.</typeparam>
        /// <param name="prompt">Control selection prompt</param>
        protected List<SelectListItem> PopulateEnumDropDownList<TEnum>(string prompt)
            where TEnum : struct, IComparable, IFormattable, IConvertible
        {
            var enumSelectList = new List<SelectListItem>
            {
                new SelectListItem
                {
                    Text = prompt,
                    Value = string.Empty,
                },
            };
            foreach (TEnum enumValue in Enum.GetValues(typeof(TEnum)))
            {
                string enumText = Enum.GetName(typeof(TEnum), enumValue);
                if (!string.Equals(enumText, "None", StringComparison.CurrentCultureIgnoreCase))
                    enumSelectList.Add(new SelectListItem { Text = Enum.GetName(typeof(TEnum), enumValue), Value = enumValue.ToString() });
            }
            return enumSelectList;
        }

        /// <summary>
        /// Creates a SelectListModel from the Name properties in a database table.
        /// </summary>
        /// <typeparam name="TDomainModel">DomainModel.</typeparam>
        /// <typeparam name="TViewModel">TGetModel implementing IProject.</typeparam>
        /// <param name="dbContext">Database context.</param>
        /// <param name="userId">Owning User Id; permit only authorized models.</param>
        /// <param name="projectId">Owning Project Id; permit only authorized models.</param>
        /// <param name="prompt">Control selection prompt</param>
        /// <param name="selectedRow">(Optional) Primary key of selected row</param>
        protected async Task<List<SelectListItem>> PopulateModelDropDownList<TDomainModel, TViewModel>(ModelReliefDbContext dbContext, string userId, int? projectId, string prompt, int? selectedRow = 0)
            where TDomainModel : DomainModel
            where TViewModel : IModel, Dto.IProjectModel
        {
            var modelSelectList = new List<SelectListItem>
            {
                new SelectListItem
                {
                    Text = prompt,
                    Value = string.Empty,
                },
            };
            var models = await Query.FindDtoModelsAsync<TDomainModel, TViewModel>(User);
            var filteredModels = models.Where(m => m.ProjectId == SettingsManager.UserSession.ProjectId);

            foreach (TViewModel model in filteredModels)
            {
                string modelText = model.Name;
                bool selectedState = model.Id == (selectedRow ?? 0);
                modelSelectList.Add(new SelectListItem { Text = modelText, Value = model.Id.ToString(), Selected = selectedState });
            }
            return modelSelectList;
        }

         /// <summary>
        /// Filters a model collection by the active Project.
        /// </summary>
        /// <param name="models">Model collection (unfiltered)</param>
        protected async Task<IEnumerable<TGetModel>> FilterModelCollectionByActiveProject(IEnumerable<TGetModel> models)
        {
            await SettingsManager.InitializeUserSessionAsync(User);
            var activeProjectModels = models.Where(m => (
                (m as Dto.IProjectModel) == null ? true : (m as Dto.IProjectModel).ProjectId == SettingsManager.UserSession.ProjectId));

            return activeProjectModels;
        }
    }
}