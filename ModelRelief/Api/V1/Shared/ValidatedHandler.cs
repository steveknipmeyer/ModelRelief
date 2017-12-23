// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using MediatR;
using ModelRelief.Database;
using ModelRelief.Api.V1.Shared.Errors;
using System;
using Microsoft.AspNetCore.Identity;
using ModelRelief.Domain;
using System.Security.Claims;
using ModelRelief.Utility;
using Microsoft.EntityFrameworkCore;
using FluentValidation.Results;
using System.Reflection;
using System.Diagnostics;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;
using ModelRelief.Services;
using System.IO;
using ModelRelief.Api.V1.Shared.Rest;

namespace ModelRelief.Api.V1.Shared
{
    /// <summary>
    /// Abstract representation of request handler that supports validation.
    /// </summary>
    /// <typeparam name="TRequest">Request object.</typeparam>
    /// <typeparam name="TResponse">Response object.</typeparam>
    public abstract class ValidatedHandler<TRequest, TResponse> : ICancellableAsyncRequestHandler<TRequest, TResponse> 
        where TRequest : IRequest<TResponse>
    {
        public UserManager<ApplicationUser> UserManager { get; }
        public ModelReliefDbContext DbContext { get; }
        public IMapper Mapper { get; }
        public IHostingEnvironment HostingEnvironment { get; }
        public Services.IConfigurationProvider ConfigurationProvider { get; }
        public IEnumerable<IValidator<TRequest>> Validators { get; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="userManager">UserManager (ClaimsPrincipal -> ApplicationUser).</param>
        /// <param name="dbContext">Database context.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="validators">List of validators</param>
        public ValidatedHandler(UserManager<ApplicationUser> userManager, ModelReliefDbContext dbContext, IMapper mapper, IHostingEnvironment hostingEnvironment, Services.IConfigurationProvider  configurationProvider, IEnumerable<IValidator<TRequest>> validators)
        {
            UserManager = userManager ?? throw new System.ArgumentNullException(nameof(dbContext));
            DbContext = dbContext ?? throw new System.ArgumentNullException(nameof(dbContext));
            Mapper = mapper ?? throw new System.ArgumentNullException(nameof(mapper));
            HostingEnvironment = hostingEnvironment;
            ConfigurationProvider = configurationProvider;

            // WIP Why are duplicate validators injected here?
            //     Remove duplicates by grouping by Type name.
            Validators = validators?
                .GroupBy(v => v.GetType().Name)
                .Select(group => group.First());
        }

        /// <summary>
        /// Returns the domain model for a given Id.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="claimsPrincipal">Current HttpContext User.</param>
        /// <param name="id">Target id to retrieve.</param>
        /// <returns>Domain model if exists, null otherwise.</returns>
        public virtual async Task<TEntity> FindModelAsync<TEntity> (ClaimsPrincipal claimsPrincipal, int id)
            where TEntity : DomainModel
        {
            var user = await Identity.FindApplicationUserAsync(UserManager, claimsPrincipal);
            var domainModel = await DbContext.Set<TEntity>()
                                .Where(m => (m.Id == id) && 
                                            (m.UserId == user.Id))
                                .SingleOrDefaultAsync();
            return domainModel;
        }

        /// <summary>
        /// Returns true if the domain model exists for a given Id.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="claimsPrincipal">Current HttpContext User.</param>
        /// <param name="id">Target id to test.</param>
        /// <returns>True if model exists.</returns>
        public virtual async Task<bool> ModelExistsAsync<TEntity> (ClaimsPrincipal claimsPrincipal, int id)
            where TEntity : DomainModel
        {
            var domainModel = await FindModelAsync<TEntity>(claimsPrincipal, id);
            return domainModel != null;
        }           

        /// <summary>
        /// Returns the associated model storage folder for a given model instance.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="model">Model instance. </param>
        /// <param name="user">Owning user.</param>
        /// <returns></returns>
        public string ModelStorageFolder<TEntity> (TEntity model, ApplicationUser user)
            where TEntity : DomainModel
        {
            var storeUsers  = ConfigurationProvider.GetSetting(ResourcePaths.StoreUsers);
            var modelRootFolder = ConfigurationProvider.GetSetting(($"ResourcePaths:Folders:{typeof(TEntity).Name}"));

            string modelStorageFolder = $"{HostingEnvironment.WebRootPath}{storeUsers}{user.Id}/{modelRootFolder}/{model.Id}/";
            return Path.GetFullPath(modelStorageFolder);
        }

        /// <summary>
        /// Returns the associated disk file for a given model instance.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="model">Model instance. The filename is the model ID.</param>
        /// <param name="user">Owning user.</param>
        /// <returns></returns>
        public string ModelFileName<TEntity> (TEntity model, ApplicationUser user)
            where TEntity : DomainModel
        {
            var modelStorageFolder = ModelStorageFolder(model, user);
            string fileName = $"{modelStorageFolder}{model.Name}";

            return fileName;
        }

        /// <summary>
        /// Validated the property references of the given model to ensure they exist and are owned by the active user.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="model">Model to validate.</param>
        /// <param name="claimsPrincipal">Active user for this request.</param>
        public async Task ValidateReferences<TEntity> (TEntity model, ClaimsPrincipal claimsPrincipal)
            where TEntity : DomainModel
        {
            var validationFailures = new List<ValidationFailure>();

            Type type = model.GetType();
            PropertyInfo[] properties = type.GetProperties();
            foreach (PropertyInfo property in properties)
            {
                var propertyName  = property.Name;
                var propertyValue = property.GetValue(model, null);

                if (propertyName == "Id")
                    continue;
                if (propertyValue == null)
                    continue;

                // foreign key?
                if (!propertyName.EndsWith("Id"))
                    continue;

                // find actual reference property
                var referencePropertyName = propertyName.Substring(0, propertyName.LastIndexOf("Id"));
                var referenceType         = type.GetProperty(referencePropertyName)?.PropertyType;
                
                if (referenceType == null)
                    continue;

                Console.WriteLine("Verifying reference property: " + propertyName + ", Value: " + propertyValue, null);

                // https://stackoverflow.com/questions/298976/is-there-a-better-alternative-than-this-to-switch-on-type
                var modelExists = false;
                Func<ClaimsPrincipal, int, Task<bool>> modelExistsAsyncMethod = null;

                switch(referenceType.Name) {
                    case nameof(Domain.Camera):
                        modelExistsAsyncMethod = ModelExistsAsync<Domain.Camera>;
                        break;
                    case nameof(Domain.DepthBuffer):
                        modelExistsAsyncMethod = ModelExistsAsync<Domain.DepthBuffer>;
                        break;
                    case nameof(Domain.MeshTransform):
                        modelExistsAsyncMethod = ModelExistsAsync<Domain.MeshTransform>;
                        break;
                    case nameof(Domain.Model3d):
                        modelExistsAsyncMethod = ModelExistsAsync<Domain.Model3d>;
                        break;
                    case nameof(Domain.Project):
                        modelExistsAsyncMethod = ModelExistsAsync<Domain.Project>;
                        break;

                    case nameof(ApplicationUser):
                        continue;
                    default:
                        var message = "Unexpected type encountered in ValidatedHandler:ValidateReferences";
                        Debug.Assert(false, message);
                        throw new ArgumentException(message);
                }

                modelExists = await modelExistsAsyncMethod (claimsPrincipal, (int) propertyValue);
                if (!modelExists)
                    validationFailures.Add(new ValidationFailure(propertyName, $"Property '{propertyName}' references an entity that does not exist."));
            }

            if (validationFailures.Count() > 0)
            {
                // package TRequest type with FV ValidationException
                throw new ApiValidationException(typeof(TRequest), validationFailures);
            }
        }

        /// <summary>
        /// Abstract pre-handler; performns any initialization or setup required before the request is handled..
        /// </summary>
        /// <param name="message">Request object</param>
        /// <param name="cancellationToken">Token to allow asyn request to be cancelled.</param>
        /// <returns></returns>
        public virtual async Task PreHandle(TRequest message, CancellationToken cancellationToken)
        {
            await Task.CompletedTask;
        }

        /// <summary>
        /// Validation pre-processor for request.
        /// </summary>
        /// <param name="message">Request object</param>
        /// <param name="cancellationToken">Token to allow asyn request to be cancelled.</param>
        /// <returns></returns>
        public async Task<TResponse> Handle(TRequest message, CancellationToken cancellationToken)
        {
            // perform any setup required before validation
            await PreHandle(message, cancellationToken);

            // All request validators will run through here first before moving onto the OnHandle request.
            if (Validators != null)
            {
                // WIP Exactly how does this LINQ produce a list of errors?
                var validationResult = (await Task.WhenAll(Validators
                    .Where(v => v != null)
                    .Select(v => v.ValidateAsync(message))))
                    .SelectMany(v => v.Errors);

                if (validationResult.Any())
                {
                    // package TRequest type with FV ValidationException
                    throw new ApiValidationException(typeof(TRequest), validationResult);
                }
            }
            return await OnHandle(message, cancellationToken);
        }

        /// <summary>
        /// Abstract request handler; implemented in concrete class.
        /// </summary>
        /// <param name="message">Request object</param>
        /// <param name="cancellationToken">Token to allow asyn request to be cancelled.</param>
        /// <returns></returns>
        public abstract Task<TResponse> OnHandle(TRequest message, CancellationToken cancellationToken);
    }
}