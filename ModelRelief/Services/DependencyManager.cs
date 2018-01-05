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
        public EntityEntry          ChangeTrackerEntity { get; }
        public ModelReliefDbContext DbContext { get; }
        public List<Type>           DependentTypes { get; set; } 

        /// <summary>
        /// Constructor.
        /// </summary>
        public TransactionEntity (EntityEntry entity, ModelReliefDbContext dbContext)
        {
            ChangeTrackerEntity = entity;
            DbContext = dbContext;

            Initialize();
        }

        /// <summary>
        /// Returns the Type of the entity.
        /// </summary>
        public Type EntityType => ChangeTrackerEntity.Entity.GetType();

        /// <summary>
        /// Returns the name of the entity type.
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
        /// Returns the DomainModel of the transaction entity.
        /// </summary>
        public async Task<DomainModel> GetDomainModel()
        {
            var findMethod = typeof(TransactionEntity).GetMethod(nameof(FindDomainModelAsync)).MakeGenericMethod(EntityType);
            var model = await (Task<DomainModel>)findMethod.Invoke(this, null);
            return model;
        }

        /// <summary>
        /// Returns whether the entity is a GeneratedFileDomainModel.
        /// </summary>
        public async Task<bool> IsGeneratedFileDomainModel()
        {
            var generatedFileDomainModel = await GetDomainModel() as GeneratedFileDomainModel;
            return generatedFileDomainModel != null;
        }

        /// <summary>
        /// Helper method to return the DomainModel corresponding to the TransactionEntity.
        /// This method is always called through reflection since the type is not known at compile time.
        /// </summary>
        /// <typeparam name="TEntity">DomainModel</typeparam>
        public async Task<DomainModel> FindDomainModelAsync<TEntity>()
            where TEntity : DomainModel
        {
            var domainModel = await DbContext.Set<TEntity>()
                                .Where(m => (m.Id == PrimaryKey) && 
                                            (m.UserId == UserId))
                                .SingleOrDefaultAsync();
            return domainModel;
        }

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
        public async Task<List<DomainModel>> FindRootDependentModels<TEntity> (Type rootType, int rootPrimaryId, string userId)
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

            foreach (Type dependentType in dependentTypes)
            {
                var method = typeof(DependencyManager).GetMethod(nameof(FindRootDependentModels)).MakeGenericMethod(dependentType);
                var dependentModelsByType = await (Task<List<DomainModel>>)method.Invoke(this, new object[] {rootType, rootPrimaryKey, userId});

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
        /// <param name="type"></param>
        /// <returns></returns>
        private IFileRequest ConstructFileRequest(Type type)
        {
            // https://stackoverflow.com/questions/8376622/create-constructor-for-generic-class-using-reflection
            var fileRequestType = typeof(FileRequest<>).MakeGenericType(type);
            ConstructorInfo constructor = fileRequestType.GetConstructor(new Type[]{});
            var fileRequest = constructor.Invoke(new object[]{});

            return fileRequest as IFileRequest;
        }

        /// <summary>
        /// Constructs a FileRequest for a model that has changed the metadata Name.
        /// The FileRequest will rename the disk file to match the metadata.
        /// </summary>
        /// <param name="transactionEntity"></param>
        private async Task<IFileRequest> ConstructRenameFileRequest(TransactionEntity transactionEntity)
        {
            var domainModel = await transactionEntity.GetDomainModel();
            var renameFileRequest = ConstructFileRequest (domainModel.GetType());

            renameFileRequest.Operation = FileOperation.Rename;
            renameFileRequest.User      = domainModel.User;
            renameFileRequest.Id        = domainModel.Id;
            
            return renameFileRequest;
        }

        /// <summary>
        /// Constructs a FileRequest for a model that has toggled the FileIsSynchronized property to true.
        /// The FileRequest will regenerate the disk file to match its dependents.
        /// </summary>
        /// <param name="transactionEntity"></param>
        private async Task<IFileRequest> ConstructGenerateFileRequest(TransactionEntity transactionEntity)
        {
            var domainModel = await transactionEntity.GetDomainModel();
            var generateFileRequest = ConstructFileRequest (domainModel.GetType());

            generateFileRequest.Operation = FileOperation.Generate;
            generateFileRequest.User      = domainModel.User;
            generateFileRequest.Id        = domainModel.Id;
            
            return generateFileRequest;
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
                var fileRequestsAll = new List<IFileRequest>();
                foreach (var changedEntity in DbContext.ChangeTracker.Entries().ToList())
                {
                    var transactionEntity = new TransactionEntity(changedEntity, DbContext);

                    var fileRequestsByEntity = new List<IFileRequest> ();
                    switch (changedEntity.State)
                    {
                        case EntityState.Added:
                            fileRequestsByEntity = await ProcessAddedEntity(transactionEntity);
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

                    fileRequestsAll.AddRange(fileRequestsByEntity);
                }
                await ProcessRequests(fileRequestsAll);
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
        /// <returns>List of FileRequests.</returns>
        private async Task<List<IFileRequest>> ProcessModifiedEntity(TransactionEntity transactionEntity)
        {
            var fileRequests = new List<IFileRequest>() ;
            var isGeneratedFileDomainModel = await transactionEntity.IsGeneratedFileDomainModel();

            bool dependentFIlePropertyChanged = false;
            foreach(var property in transactionEntity.ChangeTrackerEntity.OriginalValues.Properties)
            {
                var propertyModification = new PropertyModification(transactionEntity.ChangeTrackerEntity, property);
                if (propertyModification.Changed)
                {
                    if (isGeneratedFileDomainModel)
                    {
                        if (String.Equals(property.Name, "Name"))
                            fileRequests.Add (await ConstructRenameFileRequest(transactionEntity));

                        if ((String.Equals(property.Name, "FileIsSynchronized")) && ((bool) propertyModification.ModifiedValue))
                            fileRequests.Add (await ConstructGenerateFileRequest(transactionEntity));
                     }
                     
                    // independent variables invalidate the backing file of their dependent models
                    if (PropertyHasAttribute(out Attribute dependentFileProperty, transactionEntity.EntityType, property.Name, typeof(DependentFileProperty)))
                        dependentFIlePropertyChanged = true;
                }
            }

            if (dependentFIlePropertyChanged)
            {
                var dependentModels = await FindDependentModels(transactionEntity);
                foreach (var dependentModel in dependentModels)    
                {
                    // all dependent models that have backing files are no longer synchronized
                    var generatedFileDomainModel = dependentModel as GeneratedFileDomainModel;
                    if (generatedFileDomainModel != null)
                    {
                        generatedFileDomainModel.FileIsSynchronized = false;
                        Console.ForegroundColor = ConsoleColor.Magenta;
                        Console.WriteLine($"The dependent file {generatedFileDomainModel.Name} of type {generatedFileDomainModel.GetType().Name} is no longer synchronized.");
                        Console.ForegroundColor = ConsoleColor.White;
                    }
                }                        
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
            var fileRequests = new List<IFileRequest>() ;
            var dependentModels = new List<DomainModel>();

            if (!transactionEntity.HasDependents)
                return fileRequests;

            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"Deleted class {transactionEntity.EntityType} has (first) dependent file {transactionEntity.DependentTypes[0]}.");
            Console.ForegroundColor = ConsoleColor.White;

            dependentModels = await FindDependentModels(transactionEntity);

            // WIP: Construct FileRequests...

            return fileRequests;
        }

        /// <summary>
        /// Process an entity scheduled for addition by the ChangeTracker.
        /// </summary>
        /// <param name="transactionEntity">Entity scheduled for addition.</param>
        /// <returns>List of FileRequests.</returns>
        private async Task<List<IFileRequest>> ProcessAddedEntity(TransactionEntity transactionEntity)
        {
            var fileRequests = new List<IFileRequest>() ;

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine($"Class {transactionEntity.EntityType} has been added.");
            Console.ForegroundColor = ConsoleColor.White;

            await Task.CompletedTask;

            // WIP: Construct FileRequests...

            return fileRequests;
        }

        /// <summary>
        /// Process the requests resulting from the transactions.
        /// </summary>
        /// <param name="fileRequests">All FileRequests resulting from the current transaction.</param>
        private async Task ProcessRequests(List<IFileRequest> fileRequests)
        {
            foreach (var request in fileRequests)
            {
                var result = await HandleRequestAsync(request);

                Console.ForegroundColor = ConsoleColor.Magenta;
                Console.WriteLine($"{request.GetType()} Operation = {request.Operation.ToString()}");
                Console.ForegroundColor = ConsoleColor.White;
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
        /// <param name="fileRequest">FileRequest</param>
        /// <returns></returns>
        private async Task<bool> HandleRequestAsync (IFileRequest fileRequest)
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
        public async Task<int> PersistChangesAsync(DomainModel model, CancellationToken cancellationToken = default(CancellationToken))
        {
            await PreProcessChanges(model);

            var result = await DbContext.SaveChangesAsync();

            PostProcessChanges();

            return result;
        }
    }
}
