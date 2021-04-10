// -----------------------------------------------------------------------
// <copyright file="ViewFileModelController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using AutoMapper;
    using MediatR;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.ModelBinding;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Errors;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
    using ModelRelief.Features.Settings;
    using ModelRelief.Utility;

    public abstract class ViewFileModelController<TEntity, TGetModel, TRequestModel> : ViewController<TEntity, TGetModel, TRequestModel>
        where TEntity         : DomainModel
        where TGetModel       : class, IFileModel, new()            // class to allow default null parameter in InitializeViewControls
        where TRequestModel   : IFileModel
    {
        protected IDbFactory DbFactory { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ViewFileModelController{TEntity, TGetModel, TRequestModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="settingsManager">Settings manager.</param>
        /// <param name="mediator">IMediator</param>
        /// <param name="query">IQuery</param>
        /// <remarks>Defaults to use paging.</remarks>
        protected ViewFileModelController(
                ModelReliefDbContext dbContext,
                ILoggerFactory loggerFactory,
                IMapper mapper,
                ISettingsManager settingsManager,
                IMediator mediator,
                IQuery query)
            : base(dbContext, loggerFactory, mapper, settingsManager, mediator, query)
        {
        }

        #region Create
        /// <summary>
        /// Action handler for a Create request.
        /// </summary>
        /// <param name="postRequest">Model to create.</param>
        /// <returns>Create page.</returns>
        [HttpPost]
        [Consumes("multipart/form-data")]
        [ValidateAntiForgeryToken]
        public override async Task<IActionResult> Create(TRequestModel postRequest)
        {
            var newModel = await HandleRequestAsync(new PostFormRequest<TEntity, TRequestModel, TGetModel>
            {
                User = User,
                FileModel = postRequest,
            });

            if (newModel == null)
            {
                var errorResponse = new PostFormErrorResponse(postRequest.Name, postRequest.FormFile.FileName, ModelState);
                return Json(errorResponse);
            }

            // https://stackoverflow.com/questions/47903390/asp-net-mvc-redirecttoaction-doesnt-work-after-ajax-post-from-view
            return Json(new { redirectToUrl = Url.Action("Index", "Models") });
        }
       #endregion
    }
}