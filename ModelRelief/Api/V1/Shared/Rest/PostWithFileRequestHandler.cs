// -----------------------------------------------------------------------
// <copyright file="PostWithFileRequestHandler.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Security.Claims;
    using System.Threading;
    using System.Threading.Tasks;
    using AutoMapper;
    using FluentValidation;
    using FluentValidation.Results;
    using MediatR;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Errors;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
    using ModelRelief.Features.Settings;
    using ModelRelief.Services.Relationships;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents a handler for a POST request to create a new model and the backing file.
    /// </summary>
    /// <typeparam name="TEntity">Domain model</typeparam>
    /// <typeparam name="TRequestModel">DTO Post model.</typeparam>
    /// <typeparam name="TGetModel">DTO GET model.</typeparam>
    public class PostWithFileRequestHandler<TEntity, TRequestModel, TGetModel> : ValidatedHandler<PostWithFileRequest<TEntity, TRequestModel, TGetModel>, TGetModel>
        where TEntity    : DomainModel
        where TGetModel  : class, IFileModel
        where TRequestModel  : class, IFileModel
    {
        protected IMediator Mediator { get; set; }
        protected IDbFactory DbFactory { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="PostWithFileRequestHandler{TEntity, TRequestModel, TGetModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IWebHostEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="dependencyManager">Services for dependency processing.</param>
        /// <param name="validators">All validators matching IValidator for the given request.</param>
        /// <param name="settingsManager">ISettingsManager</param>
        /// <param name="query">IQuery</param>
        /// <param name="modelReferenceValidator">IModelReferenceValidator</param>
        /// <param name="mediator">IMediator</param>
        /// <param name="dbFactory">IDbFactory</param>
        public PostWithFileRequestHandler(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IWebHostEnvironment hostingEnvironment,
            Services.IConfigurationProvider  configurationProvider,
            IDependencyManager dependencyManager,
            IEnumerable<IValidator<PostWithFileRequest<TEntity, TRequestModel, TGetModel>>> validators,
            ISettingsManager settingsManager,
            IQuery query,
            IModelReferenceValidator modelReferenceValidator,
            IMediator mediator,
            IDbFactory dbFactory)
            : base(dbContext, loggerFactory, mapper, hostingEnvironment, configurationProvider, dependencyManager, validators, settingsManager, query, modelReferenceValidator)
        {
            Mediator = mediator ?? throw new System.ArgumentNullException(nameof(Mediator));
            DbFactory = dbFactory ?? throw new System.ArgumentNullException(nameof(DbFactory));
        }

        /// <summary>
        /// Handles a POST request to create a new model and the backing file.
        /// </summary>
        /// <param name="request">POST file request.</param>
        /// <param name="cancellationToken">Token to allow the async operation to be cancelled.</param>
        /// <returns>TGetModel for file</returns>
        public override async Task<TGetModel> OnHandle(PostWithFileRequest<TEntity, TRequestModel, TGetModel> request, CancellationToken cancellationToken)
        {
            var newModel = await CreateModelAsync(request.User, request.FileModel);
            if (newModel == null)
                return null;

            newModel = await CreateFileAsync(request.User, request.FileModel, newModel.Id);
            if (newModel == null)
                return null;

            newModel = await PostProcessAsync(await request.ApplicationUserAsync(), newModel);
            if (newModel == null)
                return null;

            return newModel;
        }

        /// <summary>
        /// Post process a PostWithFileRequest.
        /// </summary>
        /// <param name="user">Active user</param>
        /// <param name="newModel">New model to post-processs.</param>
        protected virtual async Task<TGetModel> PostProcessAsync(ApplicationUser user, TGetModel newModel)
        {
            await Task.CompletedTask;
            return newModel;
        }

        /// <summary>
        /// Helper method for creating the FileModel model.
        /// </summary>
        /// <param name="user">User owner.</param>
        /// <param name="fileModel">Model to create.</param>
        /// <returns>TGetModel if successful</returns>
        private async Task<TGetModel> CreateModelAsync(ClaimsPrincipal user, IFileModel fileModel)
        {
            TGetModel newModel = await Mediator.Send(new PostRequest<TEntity, TRequestModel, TGetModel>
            {
                User = user,
                NewModel = fileModel as TRequestModel,
            }) as TGetModel;

            return newModel;
        }

        /// <summary>
        /// Creates a PostFile from an IFileModel
        /// </summary>
        /// <param name="postRequest">IFileModel POST request.</param>
        private async Task<PostFile> PostFileFromRequestAsync(IFileModel postRequest)
        {
            byte[] fileContent = null;
            using (var memoryStream = new MemoryStream(2048))
            {
                try
                {
                    await postRequest.FormFile.CopyToAsync(memoryStream);
                    fileContent = memoryStream.ToArray();
                }
                catch (Exception ex)
                {
                    var validationFailure = new ValidationFailure(nameof(PostFileFromRequestAsync), $"An error occurred reading FormFile: {postRequest.FormFile.Name}: {ex.Message}");
                    throw new ApiValidationException(typeof(PostWithFileRequest<TEntity, TRequestModel, TGetModel>), new List<ValidationFailure> { validationFailure });
                }
            }
            var postFile = new PostFile
            {
                Name = postRequest.Name,
                Raw = fileContent,
            };
            return postFile;
        }

        /// <summary>
        /// Helper method for creating the FileModel file.
        /// </summary>
        /// <param name="user">User owner.</param>
        /// <param name="postRequest">IFileModel to create.</param>
        /// <param name="id">Id of model.</param>
        /// <returns>TGetModel if successful</returns>
        private async Task<TGetModel> CreateFileAsync(ClaimsPrincipal user, IFileModel postRequest, int id)
        {
            PostFile postFile = await PostFileFromRequestAsync(postRequest);
            if (postFile == null)
                return null;

            TGetModel newModel = await Mediator.Send(new PostFileRequest<TEntity, TGetModel>
            {
                User = user,
                Id = id,
                NewFile = postFile,
            }) as TGetModel;

            return newModel;
        }
    }
}
