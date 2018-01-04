// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Logging;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Database;
using ModelRelief.Domain;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace ModelRelief.Services
{
    /// <summary>
    /// Dependency manager. 
    /// Provides support for persisting changes and updating dependencies.
    /// </summary>
    public interface IDependencyManager
    {
        ModelReliefDbContext DbContext { get; }

        Task<int> PersistChangesAsync(DomainModel model, CancellationToken cancellationToken = default(CancellationToken));
    }

    /// <summary>
    /// Represents an entity that has been scheduled for a change through the ChangeTracker.
    /// </summary>
    public class TransactionEntity
    {
        public EntityEntry  ChangeTrackerEntity { get; }
        public List<Type>   DependentTypes { get; set; } 

        /// <summary>
        /// Constructor.
        /// </summary>
        public TransactionEntity (EntityEntry entity)
        {
            ChangeTrackerEntity = entity;

            Initialize();
        }

        /// <summary>
        /// Returns the Type of the entity.
        /// </summary>
        public Type EntityType => ChangeTrackerEntity.Entity.GetType();

        /// <summary>
        /// Returns the name of the entity.
        /// </summary>
        public string Name => EntityType.Name;

        /// <summary>
        /// Returns the primary key entity.
        /// </summary>
        public int PrimaryKey => Convert.ToInt32(ChangeTrackerEntity.CurrentValues["Id"]);

        /// <summary>
        /// Returns the User Id of the entity.
        /// </summary>
        public string UserId => ChangeTrackerEntity.CurrentValues.GetValue<string>("UserId");

        /// <summary>
        /// Returns whether the entity has any dependent types.
        /// </summary>
        public bool HasDependents => DependentTypes.Any();

        /// <summary>
        /// Perform initialization.
        /// </summary>
        private void Initialize()
        {
            DependentTypes = DependencyManager.GetClassDependentFiles(EntityType);
        }
    }

    /// <summary>
    /// Represents the difference in a property state.
    /// </summary>
    public class PropertyModification
    {
        public EntityEntry ModifiedEntity { get; set; }
        public IProperty Property { get; }

        public Type PropertyType { get; set; }
        public object OriginalValue { get; set; }
        public object ModifiedValue { get; set; }

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="modifiedEntity">Entity that has changed.</param>
        /// <param name="property">Property that has changed.</param>
        public PropertyModification (EntityEntry modifiedEntity, IProperty property)
        {
            ModifiedEntity = modifiedEntity;
            Property = property;

            Initialize ();
        }

        private void Initialize()
        {
            OriginalValue = ModifiedEntity.GetDatabaseValues().GetValue<object>(Property);
            ModifiedValue = ModifiedEntity.CurrentValues[Property];
        }

        /// <summary>
        /// Returns whether the property has changed.
        /// </summary>
        public bool Changed  
        { 
            get
            {   
                // convert to string for comparison
                var originalValueString = OriginalValue?.ToString();
                var modifiedValueString = ModifiedValue?.ToString();
                return !String.Equals(originalValueString, modifiedValueString);
            }
        }
    }

    /// <summary>
    /// Dependency manager manager. 
    /// Provides support for persisting changes and updating dependencies.
    /// </summary>
    public class DependencyManager : IDependencyManager
    {
        public ModelReliefDbContext DbContext { get; }
        public ILogger Logger { get; }
        public IMediator Mediator { get; }

        public DependencyManager(ModelReliefDbContext dbContext, ILogger<DependencyManager> logger, IMediator mediator)
        {
            DbContext = dbContext;
            Logger = logger;
            Mediator = mediator;
        }

        /// <summary>
        /// Determines whether a property has the given CustomAttribute.
        /// </summary>
        /// <param name="propertyAttribute">Attribute (if found; null otherwise)</param>
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
        public static bool ClassHasAttribute (out Attribute classAttribute, Type classType, Type attributeType)
        {
            classAttribute = classType.GetCustomAttribute(attributeType, true);
            return classAttribute != null;
        }

        /// <summary>
        /// Returns a collection of dependent classes.
        /// Dependent classes are marked with the DependentFiles attribute.
        /// </summary>
        public static List<Type> GetClassDependentFiles (Type classType)
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
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="rootType">Type of root.</param>
        /// <param name="rootPrimaryId">Primary key of root.</param>
        /// <param name="userId">User ID.</param>
        /// <returns>Collection of models referencing the given root primary key and type.</returns>
        public async Task<List<DomainModel>> FindDependentModels<TEntity> (Type rootType, int rootPrimaryId, string userId)
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
                        dependentModels.Add (candidateDependentModel as DomainModel);
                }
                catch (Exception)
                {
                    Debug.WriteLine($"DependencyManager.FindDependentModels: error looking up foreign key: Class = {candidateDependentModel.GetType()}, Id = {candidateDependentModel.Id}");
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

            Func<Type, int, string , Task<List<DomainModel>>> findDependentModelsAsyncMethod = null;
            foreach (Type dependentType in dependentTypes)
            {
                switch(dependentType.Name) 
                {
                    case nameof(Domain.DepthBuffer):
                        findDependentModelsAsyncMethod = FindDependentModels<Domain.DepthBuffer>;
                        break;
                    case nameof(Domain.Mesh):
                        findDependentModelsAsyncMethod = FindDependentModels<Domain.Mesh>;
                        break;

                    default:
                        var message = "Unexpected type encountered in DependencyManger.FindDependentModels";
                        Debug.Assert(false, message);
                        throw new ArgumentException(message);
                }
                var dependentModelsByType = await findDependentModelsAsyncMethod (rootType, rootPrimaryKey, userId);

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
        /// Pre-process all pending object changes before they are written to the database.
        /// </summary>
        /// <param name="model">Model to persist.</param>
        private async Task PreProcessChanges(DomainModel model)
        {
            // https://www.exceptionnotfound.net/entity-change-tracking-using-dbcontext-in-entity-framework-6/
            try
            {
                List<DomainModel> dependentModelsAll = new List<DomainModel>();
                foreach (var changedEntity in DbContext.ChangeTracker.Entries().ToList())
                {
                    var transactionEntity = new TransactionEntity(changedEntity);
                    if (!transactionEntity.HasDependents)
                        continue;

                    var dependentModelsByEntity = new List<DomainModel> ();
                    switch (changedEntity.State)
                    {
                        case EntityState.Added:
                            dependentModelsByEntity = await ProcessAddedEntity(transactionEntity);
                            break;

                        case EntityState.Deleted:
                            dependentModelsByEntity = await ProcessDeletedEntity(transactionEntity);
                            break;

                        case EntityState.Modified:
                            dependentModelsByEntity = await ProcessModifiedEntity(transactionEntity);
                            break;

                        default:
                        case EntityState.Detached:
                        case EntityState.Unchanged:
                            break;
                    }

                    dependentModelsAll.AddRange(dependentModelsByEntity);
                }
                await ProcessDependentModels(dependentModelsAll);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"DependencyManager.PostProcess : {ex.Message}");
            }
        }

        /// <summary>
        /// Process an entity scheduled for modification by the ChangeTracker.
        /// </summary>
        /// <param name="transactionEntity">Entity scheduled for modification.</param>
        /// <returns>List of dependent models.</returns>
        private async Task<List<DomainModel>> ProcessModifiedEntity(TransactionEntity transactionEntity)
        {
            var dependentModels = new List<DomainModel>();
            bool propertyChanged = false;
            foreach(var property in transactionEntity.ChangeTrackerEntity.OriginalValues.Properties)
            {
                var propertyModification = new PropertyModification(transactionEntity.ChangeTrackerEntity, property);
                if (propertyModification.Changed)
                {
                    // not an independent variable; skip
                    if (!PropertyHasAttribute(out Attribute dependentFileProperty, transactionEntity.EntityType, property.Name, typeof(DependentFileProperty)))
                        continue;

                    propertyChanged = true;
                    // WIP: Based on context of property change, construct a postprocess request (e.g. FileGeneration, FileRename).
                }
            }

            if (propertyChanged)
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine($"Class {transactionEntity.EntityType} has (first) dependent file {transactionEntity.DependentTypes[0]}.");
                Console.ForegroundColor = ConsoleColor.White;

                dependentModels = await FindDependentModels(transactionEntity);
            }

            return dependentModels;
        }

        /// <summary>
        /// Process an entity scheduled for deletion by the ChangeTracker.
        /// </summary>
        /// <param name="transactionEntity">Entity scheduled for deletion.</param>
        /// <returns>List of dependent models.</returns>
        private async Task<List<DomainModel>> ProcessDeletedEntity(TransactionEntity transactionEntity)
        {
            var dependentModels = new List<DomainModel>();

            if (!transactionEntity.HasDependents)
                return dependentModels;

            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"Deleted class {transactionEntity.EntityType} has (first) dependent file {transactionEntity.DependentTypes[0]}.");
            Console.ForegroundColor = ConsoleColor.White;

            dependentModels = await FindDependentModels(transactionEntity);
            return dependentModels;
        }

        /// <summary>
        /// Process an entity scheduled for addition by the ChangeTracker.
        /// </summary>
        /// <param name="transactionEntity">Entity scheduled for addition.</param>
        /// <returns>List of dependent models.</returns>
        private async Task<List<DomainModel>> ProcessAddedEntity(TransactionEntity transactionEntity)
        {
            var dependentModels = new List<DomainModel>();

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine($"Class {transactionEntity.EntityType} has been added.");
            Console.ForegroundColor = ConsoleColor.White;

            await Task.CompletedTask;

            return dependentModels;
        }

        /// <summary>
        /// Process an entity scheduled for addition by the ChangeTracker.
        /// </summary>
        /// <param name="dependentModels">All models that are dependent on the current transaction.</param>
        private async Task ProcessDependentModels (List<DomainModel> dependentModels)
        {
            foreach (DomainModel model in dependentModels)
            {
                GeneratedFileDomainModel generatedFileModel = model as GeneratedFileDomainModel;
                Debug.Assert (generatedFileModel != null);

                Console.ForegroundColor = ConsoleColor.Magenta;
                Console.WriteLine($"Dependent model : Type = {generatedFileModel.GetType()}, Primary Id = {generatedFileModel.Id}, Name = {generatedFileModel.Name}");
                Console.ForegroundColor = ConsoleColor.White;

                // dispatch to registered handler
                var fileRequest = new FileRequest<Mesh>()
                    {
                        Operation = FileOperation.Generate,
                        User = model.User,
                        Id = model.Id
                    };
                var response = await HandleRequestAsync(fileRequest);
            }
        }

        /// <summary>
        /// Post-process all pending object changes after they have been written to the database.
        /// </summary>
        private void PostProcessChanges()
        {
            try
            {
            }
            catch (Exception ex)
            {   
                Debug.WriteLine($"DependencyManager.PostProcess : {ex.Message}");
            }
        }

        /// <summary>
        /// Dispatches a request (commonly FileRequest).
        /// </summary>
        /// <typeparam name="TReturn">Return type of the request.</typeparam>
        /// <param name="request">FileRequest</param>
        /// <returns></returns>
        private async Task<TReturn> HandleRequestAsync<TReturn> (IRequest<TReturn> request)
        {
            var response = await Mediator.Send(request);

            return response;
        }

        /// <summary>
        /// Save database changes asynchronously.
        /// </summary>
        /// <param name="model">Model to persist.</param>
        /// <param name="cancellationToken">Token to allow operation to be cancelled.</param>
        /// <returns>Number of state entries written to the database.</returns>
        public async Task<int> PersistChangesAsync(DomainModel model, CancellationToken cancellationToken = default(CancellationToken))
        {
            await PreProcessChanges(model);

            var result = await DbContext.SaveChangesAsync();

            PostProcessChanges();

            return result;
        }
    }
}
