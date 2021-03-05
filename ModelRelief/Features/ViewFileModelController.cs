// -----------------------------------------------------------------------
// <copyright file="ViewFileModelController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features
{
    using System.IO;
    using System.Threading.Tasks;
    using AutoMapper;
    using MediatR;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Dto;

    public abstract class ViewFileModelController<TEntity, TGetModel, TRequestModel> : ViewController<TEntity, TGetModel, TRequestModel>
        where TEntity         : DomainModel
        where TGetModel       : class, IFileModel, new()            // class to allow default null parameter in InitializeViewControls
        where TRequestModel   : IFileModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ViewFileModelController{TEntity, TGetModel, TRequestModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        /// <remarks>Defaults to use paging.</remarks>
        protected ViewFileModelController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMapper mapper, IMediator mediator)
            : base(dbContext, loggerFactory, mapper, mediator)
        {
        }

        #region Create
        /// <summary>
        /// Helper method for creating the FileModel model.
        /// </summary>
        /// <param name="postRequest">Model to create.</param>
        /// <returns>TModel if successful</returns>
        private async Task<TGetModel> CreateModel(TRequestModel postRequest)
        {
            TGetModel newModel = await HandleRequestAsync(new PostRequest<TEntity, TRequestModel, TGetModel>
            {
                User = User,
                NewModel = postRequest,
            }) as TGetModel;

            if ((newModel == null) || (!ModelState.IsValid))
                return null;

            return newModel;
        }

        /// <summary>
        /// Helper method for creating the FileModel file.
        /// </summary>
        /// <param name="postRequest">File to create.</param>
        /// <param name="id">Id of model.</param>
        /// <returns>TModel if successful</returns>
        private async Task<TGetModel> CreateFile(TRequestModel postRequest, int id)
        {
            byte[] fileContent = null;
            using (var memoryStream = new MemoryStream(2048))
            {
                await postRequest.FormFile.CopyToAsync(memoryStream);
                fileContent = memoryStream.ToArray();
            }
            var postFile = new PostFile
            {
                Raw = fileContent,
            };

            ModelState.Clear();
            TGetModel newModel = await HandleRequestAsync(new PostFileRequest<Domain.Model3d, Dto.Model3d>
            {
                User = User,
                Id = id,
                NewFile = postFile,
            }) as TGetModel;

            if ((newModel == null) || (!ModelState.IsValid))
                return null;

            return newModel;
        }

        /// <summary>
        /// Action handler for a Create request.
        /// </summary>
        /// <param name="postRequest">Model to create.</param>
        /// <returns>Create page.</returns>
        [HttpPost]
        [Consumes("multipart/form-data")]
        [ValidateAntiForgeryToken]
        public async override Task<IActionResult> Create(TRequestModel postRequest)
        {
            // model
            TGetModel newModel = await CreateModel(postRequest);
            if (newModel == null)
            {
                await InitializeViewControls(Mapper.Map<TGetModel>(postRequest));
                return View(postRequest);
            }

            // file
            newModel = await CreateFile(postRequest, newModel.Id);
            if (newModel == null)
            {
                await InitializeViewControls(Mapper.Map<TGetModel>(postRequest));
                return View(postRequest);
            }

            return this.RedirectToAction(nameof(Index));
        }
        #endregion
    }
}