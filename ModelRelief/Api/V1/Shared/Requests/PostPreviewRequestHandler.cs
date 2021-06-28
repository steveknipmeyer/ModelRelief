// -----------------------------------------------------------------------
// <copyright file="PostPreviewRequestHandler.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;
    using AutoMapper;
    using FluentValidation;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Errors;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
    using ModelRelief.Features.Settings;
    using ModelRelief.Services;
    using ModelRelief.Services.Relationships;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents a handler for a POST request to create a new model.
    /// </summary>
    /// <typeparam name="TEntity">Domain model</typeparam>
    /// <typeparam name="TGetModel">DTO GET model.</typeparam>
    public class PostPreviewRequestHandler<TEntity, TGetModel> : ValidatedHandler<PostPreviewRequest<TEntity, TGetModel>, TGetModel>
        where TEntity    : DomainModel
        where TGetModel  : IModel
    {
        private IStorageManager StorageManager { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="PostPreviewRequestHandler{TEntity, TGetModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IWebHostEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="dependencyManager">Services for dependency processing.</param>
        /// <param name="storageManager">Services for file system storage.</param>
        /// <param name="validators">All validators matching IValidator for the given request.</param>
        /// <param name="settingsManager">ISettingsManager</param>
        /// <param name="query">IQuery</param>
        /// <param name="modelReferenceValidator">IModelReferenceValidator</param>
        public PostPreviewRequestHandler(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IWebHostEnvironment hostingEnvironment,
            Services.IConfigurationProvider  configurationProvider,
            IDependencyManager dependencyManager,
            IStorageManager storageManager,
            IEnumerable<IValidator<PostPreviewRequest<TEntity, TGetModel>>> validators,
            ISettingsManager settingsManager,
            IQuery query,
            IModelReferenceValidator modelReferenceValidator)
            : base(dbContext, loggerFactory, mapper, hostingEnvironment, configurationProvider, dependencyManager, validators, settingsManager, query, modelReferenceValidator)
        {
            StorageManager = storageManager;
        }

        /// <summary>
        /// Handles a POST preview request.
        /// </summary>
        /// <param name="request">POST preview request.</param>
        /// <param name="cancellationToken">Token to allow the async operation to be cancelled.</param>
        /// <returns>TGetModel for preview</returns>
        public override async Task<TGetModel> OnHandle(PostPreviewRequest<TEntity, TGetModel> request, CancellationToken cancellationToken)
        {
            // not a file-backed model?
            if (!typeof(FileDomainModel).IsAssignableFrom(typeof(TEntity)))
                throw new ModelNotBackedByFileException(typeof(TEntity));

            var domainModel = await Query.FindDomainModelAsync<TEntity>(request.User, request.Id, throwIfNotFound: true);
            var fileDomainModel = domainModel as FileDomainModel;

            var baseImageName = $"{Path.GetFileNameWithoutExtension(domainModel.Name)}.png";
            var fileName = Path.Combine(StorageManager.DefaultModelStorageFolder(domainModel), baseImageName);

            var imageCharArray = Encoding.UTF8.GetString(request.NewPreview.Raw).ToCharArray();
            var image = Convert.FromBase64CharArray(imageCharArray, 0, imageCharArray.Length);
            await Files.WriteRawFileFromByteArray(fileName, image);

            await DependencyManager.PersistChangesAsync(fileDomainModel, cancellationToken);

            return Mapper.Map<TGetModel>(domainModel);
        }
    }
}
