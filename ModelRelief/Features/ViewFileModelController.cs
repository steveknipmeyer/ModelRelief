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
        /// Action handler for a Create request.
        /// </summary>
        /// <param name="postRequest">Model to create.</param>
        /// <returns>Create page.</returns>
        [HttpPost]
        [Consumes("multipart/form-data")]
        [ValidateAntiForgeryToken]
        public async override Task<IActionResult> Create(TRequestModel postRequest)
        {
            // Model3d entity
            TGetModel newModel = await HandleRequestAsync(new PostRequest<TEntity, TRequestModel, TGetModel>
            {
                User = User,
                NewModel = postRequest,
            }) as TGetModel;

            // validation failed; return to View
            if ((newModel == null) || (!ModelState.IsValid))
            {
                await InitializeViewControls(Mapper.Map<TGetModel>(postRequest));
                return View(postRequest);
            }

            // Model3d file
            byte[] fileContent = null;
            using (var memoryStream = new MemoryStream(2048))
            {
                await postRequest.FormFile.CopyToAsync(memoryStream);
                fileContent = memoryStream.ToArray();
            }

            // construct from request body
            var postFile = new PostFile
            {
                Raw = fileContent,
            };

            ModelState.Clear();
            newModel = await HandleRequestAsync(new PostFileRequest<Domain.Model3d, Dto.Model3d>
            {
                User = User,
                Id = newModel.Id,
                NewFile = postFile,
            }) as TGetModel;

            // validation failed; return to View
            if ((newModel == null) || (!ModelState.IsValid))
            {
                await InitializeViewControls(Mapper.Map<TGetModel>(postRequest));
                return View(postRequest);
            }

            return this.RedirectToAction(nameof(Index));
        }
        #endregion
    }
}