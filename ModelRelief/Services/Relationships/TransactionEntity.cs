// -----------------------------------------------------------------------
// <copyright file="TransactionEntity.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services.Relationships
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.ChangeTracking;
    using ModelRelief.Database;
    using ModelRelief.Domain;

    /// <summary>
    /// Represents an entity that has been scheduled for a change through the ChangeTracker.
    /// </summary>
    public class TransactionEntity
    {
        public EntityEntry          ChangeTrackerEntity { get; }
        public ModelReliefDbContext DbContext { get; }
        public List<Type>           DependentTypes { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="TransactionEntity"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="entity">ChangeTracker entity.</param>
        /// <param name="dbContext">Database context.</param>
        public TransactionEntity(EntityEntry entity, ModelReliefDbContext dbContext)
        {
            ChangeTrackerEntity = entity;
            DbContext = dbContext;

            Initialize();
        }

        /// <summary>
        /// Gets the Type of the entity.
        /// </summary>
        public Type EntityType => ChangeTrackerEntity.Entity.GetType();

        /// <summary>
        /// Gets the name of the entity type.
        /// </summary>
        public string Name => EntityType.Name;

        /// <summary>
        /// Gets the primary key entity.
        /// </summary>
        public int PrimaryKey => Convert.ToInt32(ChangeTrackerEntity.CurrentValues["Id"]);

        /// <summary>
        /// Gets the User Id of the entity.
        /// </summary>
        public string UserId => ChangeTrackerEntity.CurrentValues.GetValue<string>("UserId");

        /// <summary>
        /// Gets a value indicating whether the entity has any dependent types.
        /// </summary>
        public bool HasDependents => DependentTypes.Any();

        /// <summary>
        /// Gets the DomainModel of the transaction entity.
        /// </summary>
        public DomainModel GetDomainModel()
        {
            return ChangeTrackerEntity.Entity as DomainModel;
        }
        /// <summary>
        /// Gets the DomainModel of the transaction entity from the database.
        /// </summary>
        public async Task<DomainModel> GetDatabaseDomainModel()
        {
            var findMethod = typeof(TransactionEntity).GetMethod(nameof(FindDomainModelAsync)).MakeGenericMethod(EntityType);
            var model = await (Task<DomainModel>)findMethod.Invoke(this, null);
            return model;
        }

        /// <summary>
        /// Returns whether the entity is a GeneratedFileDomainModel.
        /// </summary>
        public bool IsGeneratedFileDomainModel()
        {
            var generatedFileDomainModel = GetDomainModel() as GeneratedFileDomainModel;
            return generatedFileDomainModel != null;
        }

        /// <summary>
        /// Returns whether the entity is a FileDomainModel.
        /// </summary>
        public bool IsFileDomainModel()
        {
            var fileDomainModel = GetDomainModel() as FileDomainModel;
            return fileDomainModel != null;
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
}
