// -----------------------------------------------------------------------
// <copyright file="ModelsController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Models
{
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using AutoMapper;
    using MediatR;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents a controller to handle Model Ux requests.
    /// </summary>
    public class ModelsController : ViewController<Domain.Model3d, Dto.Model3d, Dto.Model3d>
    {
        public Services.IConfigurationProvider ConfigurationProvider { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ModelsController"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        /// <param name="configurationProvider">Configuration provider.</param>
        public ModelsController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMapper mapper, IMediator mediator, Services.IConfigurationProvider configurationProvider)
            : base(dbContext, loggerFactory, mapper, mediator)
        {
            ConfigurationProvider = configurationProvider;
        }

        /// <summary>
        /// Action handler for Create Get.
        /// </summary>
        /// <returns>Create page.</returns>
        [HttpGet]
        public async override Task<ActionResult> Create()
        {
            var viewModel = new Dto.Model3dFormFile();
            await InitializeViewControls(viewModel);
            return View(viewModel);
        }

        /// <summary>
        /// Action handler for a Create request.
        /// </summary>
        /// <param name="postRequest">Model to create.</param>
        /// <returns>Create page.</returns>
        [HttpPost]
        [Consumes("multipart/form-data")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Dto.Model3dFormFile postRequest)
        {
            // Model3d entity
            Dto.Model3d newModel = await HandleRequestAsync(new PostRequest<Domain.Model3d, Dto.Model3d, Dto.Model3d>
            {
                User = User,
                NewModel = postRequest,
            }) as Dto.Model3d;

            // validation failed; return to View
            if ((newModel == null) || (!ModelState.IsValid))
            {
                await InitializeViewControls(Mapper.Map<Dto.Model3dFormFile>(postRequest));
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
            }) as Dto.Model3d;

            // validation failed; return to View
            if ((newModel == null) || (!ModelState.IsValid))
            {
                await InitializeViewControls(Mapper.Map<Dto.Model3dFormFile>(postRequest));
                return View(postRequest);
            }

            return this.RedirectToAction(nameof(Index));
        }

        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="model">Model instance for View.</param>
        protected async override Task InitializeViewControls(Dto.Model3d model)
        {
            var applicationUser = await IdentityUtility.FindApplicationUserAsync(User);
            var userId = applicationUser?.Id ?? string.Empty;

            ViewBag.ModelFormat  = ViewHelpers.PopulateEnumDropDownList<Model3dFormat>("Select model format");

            ViewBag.ProjectId    = ViewHelpers.PopulateModelDropDownList<Domain.Project>(DbContext, userId, "Select a project", model?.ProjectId);
            ViewBag.CameraId     = ViewHelpers.PopulateModelDropDownList<Domain.Camera>(DbContext, userId, "Select a camera", model?.CameraId);
        }
    }
}
