// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata;
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
    /// Dependency manager manager. 
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
        public object       PrimaryKey { get; set; }
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
        /// Returns the Type name of the entity.
        /// </summary>
        public string Name => EntityType.Name;

        /// <summary>
        /// Returns whether the entity has any dependent types.
        /// </summary>
        public bool HasDependents => DependentTypes.Any();

        /// <summary>
        /// Perform initialization.
        /// </summary>
        private void Initialize()
        {
            PrimaryKey = ChangeTrackerEntity.CurrentValues["Id"];

            DependentTypes = new List<Type>();
            // no class dependencies?; skip
            if (DependencyManager.ClassHasAttribute(out Attribute classAttribute, EntityType, typeof(DependentFiles)))
            {
                DependentFiles dependentFiles = classAttribute as DependentFiles;
                DependentTypes = dependentFiles.Classes;
            }
        }
    }

    /// <summary>
    /// Represents the difference in a propery state.
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

        public DependencyManager(ModelReliefDbContext dbContext)
        {
            DbContext = dbContext;
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
        /// Finds the dependent models for a given model.
        /// </summary>
        /// <param name="transactionEntity">Entity scheduled by ChangeTracker.</param>
        /// <returns>Collection of the dependent models.</returns>
        public List<DomainModel> FindDependentModels(TransactionEntity transactionEntity)
        {
            var dependentModels = new List<DomainModel>();

            return dependentModels;
        }

        /// <summary>
        /// Pre-process all pending object changes before they are written to the database.
        /// </summary>
        /// <param name="model">Model to persist.</param>
        private void PreProcessChanges(DomainModel model)
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

                    var dependentModelsEntity = new List<DomainModel> ();
                    switch (changedEntity.State)
                    {
                        case EntityState.Added:
                            dependentModelsEntity = ProcessAddedEntity(transactionEntity);
                            break;

                        case EntityState.Deleted:
                            dependentModelsEntity = ProcessDeletedEntity(transactionEntity);
                            break;

                        case EntityState.Modified:
                            dependentModelsEntity = ProcessModifiedEntity(transactionEntity);
                            break;

                        default:
                        case EntityState.Detached:
                        case EntityState.Unchanged:
                            break;
                    }

                    dependentModelsAll.AddRange(dependentModelsEntity);
                }
                ProcessDependentModels(dependentModelsAll);
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
        private List<DomainModel> ProcessModifiedEntity(TransactionEntity transactionEntity)
        {
            var dependentModels = new List<DomainModel>();
            foreach(var property in transactionEntity.ChangeTrackerEntity.OriginalValues.Properties)
            {
                var propertyModification = new PropertyModification(transactionEntity.ChangeTrackerEntity, property);
                if (propertyModification.Changed)
                {
                    // not an independent variable; skip
                    if (!PropertyHasAttribute(out Attribute dependentFileProperty, transactionEntity.EntityType, property.Name, typeof(DependentFileProperty)))
                        continue;

                    Console.ForegroundColor = ConsoleColor.Yellow;
                    Console.WriteLine($"Class {transactionEntity.EntityType} has (first) dependent files {transactionEntity.DependentTypes[0]}.");
                    Console.ForegroundColor = ConsoleColor.White;

                    dependentModels = FindDependentModels(transactionEntity);

                    // no more properties need to be examined; all dependent models found from first DependentFileProperty
                    return dependentModels;
                }
            }
            return dependentModels;
        }

        /// <summary>
        /// Process an entity scheduled for deletion by the ChangeTracker.
        /// </summary>
        /// <param name="transactionEntity">Entity scheduled for deletion.</param>
        /// <returns>List of dependent models.</returns>
        private List<DomainModel> ProcessDeletedEntity(TransactionEntity transactionEntity)
        {
            var dependentModels = new List<DomainModel>();

            if (!transactionEntity.HasDependents)
                return dependentModels;

            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"Deleted class {transactionEntity.EntityType} has (first) dependent file {transactionEntity.DependentTypes[0]}.");
            Console.ForegroundColor = ConsoleColor.White;

            dependentModels = FindDependentModels(transactionEntity);
            return dependentModels;
        }

        /// <summary>
        /// Process an entity scheduled for addition by the ChangeTracker.
        /// </summary>
        /// <param name="transactionEntity">Entity scheduled for addition.</param>
        /// <returns>List of dependent models.</returns>
        private List<DomainModel> ProcessAddedEntity(TransactionEntity transactionEntity)
        {
            var dependentModels = new List<DomainModel>();

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine($"Class {transactionEntity.EntityType} has been added.");
            Console.ForegroundColor = ConsoleColor.White;

            return dependentModels;
        }

        /// <summary>
        /// Process an entity scheduled for addition by the ChangeTracker.
        /// </summary>
        /// <param name="dependentModels">All models that are dependent on the current transaction.</param>
        private void ProcessDependentModels (List<DomainModel> dependentModels)
        {
            foreach (DomainModel model in dependentModels)
            {
                GeneratedFileDomainModel generatedFileModel = model as GeneratedFileDomainModel;
                Debug.Assert (generatedFileModel != null);

                Console.WriteLine($"Dependent model : Type = {generatedFileModel.GetType()}, Primary Id = {generatedFileModel.Id}, Name = {generatedFileModel.Name}");
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
        /// Save database changes asynchronously.
        /// </summary>
        /// <param name="model">Model to persist.</param>
        /// <param name="cancellationToken">Token to allow operation to be cancelled.</param>
        /// <returns>Number of state entries written to the database.</returns>
        public async Task<int> PersistChangesAsync(DomainModel model, CancellationToken cancellationToken = default(CancellationToken))
        {
            PreProcessChanges(model);

            var result = await DbContext.SaveChangesAsync();

            PostProcessChanges();

            return result;
        }
    }
}
