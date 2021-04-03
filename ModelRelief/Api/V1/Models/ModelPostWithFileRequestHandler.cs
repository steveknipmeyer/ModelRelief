// -----------------------------------------------------------------------
// <copyright file="ModelPostWithFileRequestHandler.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using System.Collections.Generic;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using AutoMapper;
    using FluentValidation;
    using FluentValidation.Results;
    using MediatR;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Models;
    using ModelRelief.Api.V1.Shared.Errors;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Features.Settings;
    using ModelRelief.Services.Relationships;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents a handler for a POST request to create a new model and the backing file.
    /// </summary>
    public class ModelPostWithFileRequestHandler : PostWithFileRequestHandler<Domain.Model3d, Dto.Model3d, Dto.Model3d>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ModelPostWithFileRequestHandler"/> class.
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
        public ModelPostWithFileRequestHandler(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IWebHostEnvironment hostingEnvironment,
            Services.IConfigurationProvider  configurationProvider,
            IDependencyManager dependencyManager,
            IEnumerable<IValidator<PostWithFileRequest<Domain.Model3d, Dto.Model3d, Dto.Model3d>>> validators,
            ISettingsManager settingsManager,
            IQuery query,
            IModelReferenceValidator modelReferenceValidator,
            IMediator mediator,
            IDbFactory dbFactory)
            : base(dbContext, loggerFactory, mapper, hostingEnvironment, configurationProvider, dependencyManager, validators, settingsManager, query, modelReferenceValidator, mediator, dbFactory)
        {
        }
        /// <summary>
        /// Post process a PostWithFileRequest.
        /// </summary>
        /// <param name="applicationUser">Active user</param>
        /// <param name="newModel">New model to post-processs.</param>
        protected override async Task<Dto.Model3d> PostProcessAsync(ApplicationUser applicationUser, Dto.Model3d newModel)
        {
            var model3d = await Query.FindDomainModelAsync<Domain.Model3d>(applicationUser, newModel.Id);

            // contents validated upstream; assign format now
            model3d.Format = ModelPostFileRequestValidator.MapFormatFromExtension(newModel.Name);

            model3d = DbFactory.AddModel3dRelated(applicationUser, model3d);
            if (model3d == null)
            {
                var validationFailure = new ValidationFailure(nameof(PostProcessAsync), $"An error happened while adding the related resources for {newModel.Name}.");
                throw new ApiValidationException(typeof(PostWithFileRequest<Domain.Model3d, Dto.Model3d, Dto.Model3d>), new List<ValidationFailure> { validationFailure });
            }

            return Mapper.Map<Domain.Model3d, Dto.Model3d>(model3d);
        }
    }
}
