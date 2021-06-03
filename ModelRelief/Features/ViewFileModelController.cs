// -----------------------------------------------------------------------
// <copyright file="ViewFileModelController.cs" company="ModelRelief">
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
    using ModelRelief.Api.V1.Shared.Responses;
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

        #region Get
        /// <summary>
        /// Get a file associated with a model.
        /// </summary>
        /// <param name="id">Model Id.</param>
        /// <param name="fileQueryParameters">File query parameters.</param>
        /// <returns>Preview image.</returns>
        [DisableRequestSizeLimit]
        public virtual async Task<FileContentResult> File(int id, [FromQuery] GetFileQueryParameters fileQueryParameters)
        {
            var response = await GetFileByType(id, fileQueryParameters);
            return response;
        }

        /// <summary>
        /// Get a preview file associated with a model.
        /// </summary>
        /// <param name="id">Model Id.</param>
        /// <returns>Preview image.</returns>
        [DisableRequestSizeLimit]
        public virtual async Task<FileContentResult> Preview(int id)
        {
            return await GetFileByType(id, new GetFileQueryParameters { Extension = "png" });
        }

        /// <summary>
        ///  Helper to get a specific file type.
        /// </summary>
        /// <param name="id">Model Id.</param>
        /// <param name="fileQueryParameters">File query parameters.</param>
        /// <returns></returns>
        private async Task<FileContentResult> GetFileByType(int id, GetFileQueryParameters fileQueryParameters = null)
        {
            var response = await HandleRequestAsync(new GetFileRequest<TEntity>
            {
                User = User,
                Id = id,

                // (optional) query parameters
                QueryParameters = fileQueryParameters,
            }) as FileContentResult;

            return response;
        }
        #endregion

        #region Create
        /// <summary>
        /// Action handler for a Create request.
        /// </summary>
        /// <param name="postRequest">Model to create.</param>
        /// <param name="postQueryParameters">Query parameters.</param>
        /// <returns>Create page.</returns>
        [HttpPost]
        [Consumes("multipart/form-data")]
        [ValidateAntiForgeryToken]
        [DisableRequestSizeLimit]
        public override async Task<IActionResult> Create(TRequestModel postRequest, [FromQuery] PostQueryParameters postQueryParameters)
        {
            var newModel = await HandleRequestAsync(new PostFormRequest<TEntity, TRequestModel, TGetModel>
            {
                User = User,
                FileModel = postRequest,
            });

            var response = new PostFormResponse(postRequest.Name, postRequest.FormFile.FileName);
            if (newModel == null)
            {
                response.AddErrors(ModelState);
            }
            else
            {
                response.Success = true;
                response.RedirectToUrl = Url.Action("Index", "Models");
            }

            return Json(response);
        }
       #endregion
    }
}