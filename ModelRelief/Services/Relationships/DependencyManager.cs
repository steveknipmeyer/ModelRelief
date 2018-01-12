// -----------------------------------------------------------------------
// <copyright file="DependencyManager.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services.Relationships
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Reflection;
    using System.Threading;
    using System.Threading.Tasks;
    using MediatR;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Domain;

    /// <summary>
    /// Dependency manager manager.
    /// Provides support for persisting changes and updating dependencies.
    /// </summary>
    public class DependencyManager : IDependencyManager
    {
        public ModelReliefDbContext         DbContext { get; }
        public ILogger<DependencyManager>   Logger { get; }
        public IMediator                    Mediator { get; }

        public DependencyManager(ModelReliefDbContext dbContext, ILogger<DependencyManager> logger, IMediator mediator)
        {
            DbContext = dbContext;
            Logger = logger;
            Mediator = mediator;
        }

        /// <summary>
        /// Determines whether a property has the given CustomAttribute.
        /// </summary>
        /// <param name="propertyAttribute">Attribute (if found; null otherwise).</param>
        /// <param name="classType">Class of property.</param>
        /// <param name="propertyName">Name of property.</param>
        /// <param name="attributeType">CustomAttribute to find.</param>
        /// <returns></returns>
        public static bool PropertyHasAttribute(out Attribute propertyAttribute, Type classType, string propertyName, Type attributeType)
        {
            PropertyInfo property = classType.GetProperty(propertyName);
            propertyAttribute = property.GetCustomAttribute(attributeType, true);
            return propertyAttribute != null;
        }

        /// <summary>
        /// determines whether a class has the given CustomAttribute.
        /// </summary>
        /// <param name="classAttribute">Attribute (if found, null otherwise)</param>
        /// <param name="classType">Type of class.</param>
        /// <param name="attributeType">CustomAttribute to find.</param>
        /// <returns></returns>
        public static bool ClassHasAttribute(out Attribute classAttribute, Type classType, Type attributeType)
        {
            classAttribute = classType.GetCustomAttribute(attributeType, true);
            return classAttribute != null;
        }

        /// <summary>
        /// Returns a collection of dependent classes.
        /// Dependent classes are marked with the DependentFiles attribute.
        /// </summary>
        /// <param name="classType">Type of class.</param>
        public static List<Type> GetClassDependentFiles(Type classType)
        {
            var dependentClasses = new List<Type>();

            // class attribute exists?
            if (DependencyManager.ClassHasAttribute(out Attribute classAttribute, classType, typeof(DependentFiles)))
            {
                DependentFiles dependentFiles = classAttribute as DependentFiles;
                dependentClasses = dependentFiles.Classes;
            }
            return dependentClasses;
        }

        /// <summary>
        /// Find all models that reference the given root (type and primary key).
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="rootType">Type of root.</param>
        /// <param name="rootPrimaryId">Primary key of root.</param>
        /// <param name="userId">User ID.</param>
        /// <returns>Collection of models referencing the given root primary key and type.</returns>
        public async Task<List<DomainModel>> FindRootDependentModels<TEntity>(Type rootType, int rootPrimaryId, string userId)
            where TEntity : DomainModel
        {
            var dependentModels = new List<DomainModel>();
            // find all owned models
            var candidateDependentModels = await DbContext.Set<TEntity>()
                                                    .Where(m => (m.UserId == userId))
                                                    .ToListAsync();

            // find foreign key on candidate dependent models
            var foreignKeyPropertyName = $"{rootType.Name}Id";
            var foreignKeyProperty = typeof(TEntity).GetProperty(foreignKeyPropertyName);
            foreach (var candidateDependentModel in candidateDependentModels)
            {
                try
                {
                    // compare foreign key
                    int foreignKey = Convert.ToInt32(foreignKeyProperty.GetValue(candidateDependentModel));
                    if (foreignKey == rootPrimaryId)
                        dependentModels.Add(candidateDependentModel as DomainModel);
                }
                catch (Exception)
                {
                    Logger.LogError($"DependencyManager.FindDependentModels: error looking up foreign key: Class = {candidateDependentModel.GetType()}, Id = {candidateDependentModel.Id}");
                }
            }
            return dependentModels;
        }

        /// <summary>
        /// Finds the dependent models for a given model.
        /// </summary>
        /// <param name="userId">Owning user.</param>
        /// <param name="rootType">Type of root.</param>
        /// <param name="rootPrimaryKey">Primary key of root.</param>
        /// <param name="dependentTypes">Types dependent on the root.</param>
        /// <returns>Collection of dependent models.</returns>
        public async Task<List<DomainModel>> FindDependentModels(string userId, Type rootType, int rootPrimaryKey, List<Type> dependentTypes)
        {
            var dependentModels = new List<DomainModel>();

            // primary key
            if (!(rootPrimaryKey > 0))
                return dependentModels;

            foreach (Type dependentType in dependentTypes)
            {
                var method = typeof(DependencyManager).GetMethod(nameof(FindRootDependentModels)).MakeGenericMethod(dependentType);
                var dependentModelsByType = await (Task<List<DomainModel>>)method.Invoke(this, new object[] { rootType, rootPrimaryKey, userId });

                // recursively find dependents
                dependentModels.AddRange(dependentModelsByType);
                if (dependentModelsByType.Any())
                {
                    foreach (var dependentModel in dependentModelsByType)
                    {
                        var rootTypePrime        = dependentModel.GetType();
                        var rootPrimaryKeyPrime  = dependentModel.Id;
                        var dependentTypesPrime  = DependencyManager.GetClassDependentFiles(rootTypePrime);
                        var dependentModelsPrime = await FindDependentModels(dependentModel.UserId, rootTypePrime, rootPrimaryKeyPrime, dependentTypesPrime);

                        dependentModels.AddRange(dependentModelsPrime);
                    }
                }
            }
            return dependentModels;
        }

        /// <summary>
        /// Finds the dependent models for a given model.
        /// </summary>
        /// <param name="transactionEntity">Entity scheduled by ChangeTracker.</param>
        /// <returns>Collection of the dependent models.</returns>
        public async Task<List<DomainModel>> FindDependentModels(TransactionEntity transactionEntity)
        {
            return await FindDependentModels(transactionEntity.UserId, transactionEntity.EntityType, transactionEntity.PrimaryKey, transactionEntity.DependentTypes);
        }

        /// <summary>
        /// Uses reflection to construct a FileRequest of the given type.
        /// </summary>
        /// <param name="type">FileRequest type (e.g. GenerateFileRequest).</param>
        /// <returns></returns>
        private IFileRequest ConstructFileRequest(Type type)
        {
            // https://stackoverflow.com/questions/8376622/create-constructor-for-generic-class-using-reflection
            var fileRequestType = typeof(FileRequest<>).MakeGenericType(type);
            ConstructorInfo constructor = fileRequestType.GetConstructor(new Type[] { });
            var fileRequest = constructor.Invoke(new object[] { });

            return fileRequest as IFileRequest;
        }

        /// <summary>
        /// Constructs a FileRequest for a model that has changed the metadata Name.
        /// The FileRequest will rename the disk file to match the metadata.
        /// </summary>
        /// <param name="transactionEntity">ChangeTracker entity.</param>
        private IFileRequest ConstructRenameFileRequest(TransactionEntity transactionEntity)
        {
            var domainModel = transactionEntity.GetDomainModel();
            var renameFileRequest = ConstructFileRequest(domainModel.GetType());

            renameFileRequest.Operation = FileOperation.Rename;
            renameFileRequest.Stage     = ProcessingStage.PreProcess;
            renameFileRequest.TransactionEntity = transactionEntity;

            return renameFileRequest;
        }

        /// <summary>
        /// Constructs a FileRequest for a model that has toggled the FileIsSynchronized property to true.
        /// The FileRequest will regenerate the disk file to match its dependents.
        /// </summary>
        /// <param name="transactionEntity">ChangeTracker entity.</param>
        /// <param name="stage">The processing stage (e.g. Pre, Post) that the FileRequest will be serviced.</param>
        private IFileRequest ConstructGenerateFileRequest(TransactionEntity transactionEntity, ProcessingStage stage)
        {
            var domainModel = transactionEntity.GetDomainModel();
            var generateFileRequest = ConstructFileRequest(domainModel.GetType());

            generateFileRequest.Operation = FileOperation.Generate;
            generateFileRequest.Stage     = stage;
            generateFileRequest.TransactionEntity = transactionEntity;

            return generateFileRequest;
        }

        /// <summary>
        /// Invalidates (FileIsSynchronized = false) all dependent models.
        /// If a root model changes, the backing file of all dependents is invalidated.
        /// </summary>
        /// <param name="dependentModels">Collection of dependent models.</param>
        private void InvalidateDependentModels(List<DomainModel> dependentModels)
        {
            foreach (var dependentModel in dependentModels)
            {
                // all dependent models that have backing files are no longer synchronized
                if (dependentModel is GeneratedFileDomainModel generatedFileDomainModel)
                {
                    DbContext.Entry(generatedFileDomainModel).State = EntityState.Modified;
                    generatedFileDomainModel.FileIsSynchronized = false;

                    Logger.LogInformation($"The dependent file {generatedFileDomainModel.Name} of type {generatedFileDomainModel.GetType().Name} is no longer synchronized.");
                    Console.ForegroundColor = ConsoleColor.Magenta;
                    Console.WriteLine($"The dependent file {generatedFileDomainModel.Name} of type {generatedFileDomainModel.GetType().Name} is no longer synchronized.");
                    Console.ForegroundColor = ConsoleColor.White;
                }
            }
        }

        /// <summary>
        /// Pre-process all pending object changes before they are written to the database.
        /// </summary>
        /// <param name="model">Model to persist.</param>
        /// <param name="fileRequests">FileRequest commands triggered by dependency processing.</param>
        private async Task PreProcessChanges(DomainModel model, List<IFileRequest> fileRequests)
        {
            // https://www.exceptionnotfound.net/entity-change-tracking-using-dbcontext-in-entity-framework-6/
            foreach (var changedEntity in DbContext.ChangeTracker.Entries().ToList())
            {
                var transactionEntity = new TransactionEntity(changedEntity, DbContext);

                var fileRequestsByEntity = new List<IFileRequest>();
                switch (changedEntity.State)
                {
                    case EntityState.Added:
                        fileRequestsByEntity = ProcessAddedEntity(transactionEntity);
                        break;

                    case EntityState.Deleted:
                        fileRequestsByEntity = await ProcessDeletedEntity(transactionEntity);
                        break;

                    case EntityState.Modified:
                        fileRequestsByEntity = await ProcessModifiedEntity(transactionEntity);
                        break;

                    default:
                    case EntityState.Detached:
                    case EntityState.Unchanged:
                        break;
                }

                fileRequests.AddRange(fileRequestsByEntity);
            }
            await HandlePreProcessFileRequests(fileRequests);
        }

        /// <summary>
        /// Process an entity scheduled for modification by the ChangeTracker.
        /// </summary>
        /// <param name="transactionEntity">Entity scheduled for modification.</param>
        /// <returns>List of FileRequests.</returns>
        private async Task<List<IFileRequest>> ProcessModifiedEntity(TransactionEntity transactionEntity)
        {
            var fileRequests = new List<IFileRequest>();
            var isFileDomainModel          = transactionEntity.IsFileDomainModel();
            var isGeneratedFileDomainModel = transactionEntity.IsGeneratedFileDomainModel();

            bool dependentFIlePropertyChanged = false;
            foreach (var property in transactionEntity.ChangeTrackerEntity.OriginalValues.Properties)
            {
                var propertyModification = new PropertyModification(transactionEntity.ChangeTrackerEntity, property);
                if (propertyModification.Changed)
                {
                    if (string.Equals(propertyModification.Property.Name, PropertyNames.FileTimeStamp))
                        Logger.LogInformation($"FileTimeStamp Change: {property.Name}, Original = {propertyModification.OriginalValue?.ToString()}, New = {propertyModification.ModifiedValue?.ToString()}");

                    Logger.LogInformation($"Property Change: {property.Name}, Original = {propertyModification.OriginalValue?.ToString()}, New = {propertyModification.ModifiedValue?.ToString()}");
                    if (isFileDomainModel)
                    {
                        if (string.Equals(property.Name, PropertyNames.Name))
                            fileRequests.Add(ConstructRenameFileRequest(transactionEntity));

                        if (isGeneratedFileDomainModel)
                        {
                            if (string.Equals(property.Name, PropertyNames.FileIsSynchronized) && ((bool)propertyModification.ModifiedValue))
                                fileRequests.Add(ConstructGenerateFileRequest(transactionEntity, stage: ProcessingStage.PreProcess));
                        }
                    }

                    // independent variables invalidate the backing file of their dependent models
                    if (PropertyHasAttribute(out Attribute dependentFileProperty, transactionEntity.EntityType, property.Name, typeof(DependentFileProperty)))
                        dependentFIlePropertyChanged = true;
                }
            }

            if (dependentFIlePropertyChanged)
            {
                var dependentModels = await FindDependentModels(transactionEntity);
                InvalidateDependentModels(dependentModels);
            }

            return fileRequests;
        }

        /// <summary>
        /// Process an entity scheduled for deletion by the ChangeTracker.
        /// </summary>
        /// <param name="transactionEntity">Entity scheduled for deletion.</param>
        /// <returns>List of FileRequests.</returns>
        private async Task<List<IFileRequest>> ProcessDeletedEntity(TransactionEntity transactionEntity)
        {
            var fileRequests = new List<IFileRequest>();
            var dependentModels = new List<DomainModel>();

            if (!transactionEntity.HasDependents)
                return fileRequests;

            dependentModels = await FindDependentModels(transactionEntity);
            InvalidateDependentModels(dependentModels);

            return fileRequests;
        }

        /// <summary>
        /// Process an entity scheduled for addition by the ChangeTracker.
        /// </summary>
        /// <param name="transactionEntity">Entity scheduled for addition.</param>
        /// <returns>List of FileRequests.</returns>
        private List<IFileRequest> ProcessAddedEntity(TransactionEntity transactionEntity)
        {
            var fileRequests = new List<IFileRequest>();

            if (transactionEntity.IsGeneratedFileDomainModel() &&
               ((bool)transactionEntity.ChangeTrackerEntity.CurrentValues[PropertyNames.FileIsSynchronized]))
               {
               fileRequests.Add(ConstructGenerateFileRequest(transactionEntity, stage: ProcessingStage.PostProcess));
               }
            return fileRequests;
        }

        /// <summary>
        /// Process the requests resulting from the pre-processing of the transactions.
        /// </summary>
        /// <param name="fileRequests">All FileRequests resulting from the current transaction.</param>
        private async Task HandlePreProcessFileRequests(List<IFileRequest> fileRequests)
        {
            foreach (var request in fileRequests)
            {
                if (request.Stage == ProcessingStage.PreProcess)
                {
                    var result = await HandleRequestAsync(request);

                    Console.ForegroundColor = ConsoleColor.Magenta;
                    Console.WriteLine($"PreProcess {request.GetType()} Operation = {request.Operation.ToString()}");
                    Console.ForegroundColor = ConsoleColor.White;
                }
            }
        }

        /// <summary>
        /// Process the requests resulting from the post-processing transactions.
        /// </summary>
        /// <param name="fileRequests">All FileRequests resulting from the current transaction.</param>
        private async Task HandlePostProcessFileRequests(List<IFileRequest> fileRequests)
        {
            foreach (var request in fileRequests)
            {
                if (request.Stage == ProcessingStage.PostProcess)
                {
                    // Added entities are processed here after the database save so that the primary key is known.
                    var result = await HandleRequestAsync(request);

                    Console.ForegroundColor = ConsoleColor.Magenta;
                    Console.WriteLine($"PostProcess {request.GetType()} Operation = {request.Operation.ToString()}");
                    Console.ForegroundColor = ConsoleColor.White;
                }
            }
        }

        /// <summary>
        /// Post-process all pending object changes after they have been written to the database.
        /// </summary>
        /// <param name="model">Model to persist.</param>
        /// <param name="fileRequests">FileRequest commands triggered by dependency processing.</param>
        private async Task PostProcessChanges(DomainModel model, List<IFileRequest> fileRequests)
        {
            await HandlePostProcessFileRequests(fileRequests);
        }

        /// <summary>
        /// Dispatches a request (commonly FileRequest).
        /// </summary>
        /// <param name="fileRequest">FileRequest</param>
        /// <returns></returns>
        private async Task<bool> HandleRequestAsync(IFileRequest fileRequest)
        {
            var request = fileRequest as IRequest<bool>;
            return await Mediator.Send(request);
        }

        /// <summary>
        /// Save database changes asynchronously.
        /// </summary>
        /// <param name="model">Model to persist.</param>
        /// <param name="cancellationToken">Token to allow operation to be cancelled.</param>
        /// <returns>Number of state entries written to the database.</returns>
        public async Task<int> PersistChangesAsync(DomainModel model, CancellationToken cancellationToken = default)
        {
            var fileRequests = new List<IFileRequest>();

            await PreProcessChanges(model, fileRequests);

            var result = await DbContext.SaveChangesAsync();

            await PostProcessChanges(model, fileRequests);

            return result;
        }
    }
}
