// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Configuration;
using ModelRelief.Database;
using ModelRelief.Domain;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ModelRelief.Services
{
    /// <summary>
    /// Dependency manager manager. 
    /// Provides support for persisting changes and updating dependencies.
    /// </summary>
    
    public class DependencyManager
    {
        public ModelReliefDbContext DbContext { get; }

        public DependencyManager(ModelReliefDbContext dbContext)
        {
            DbContext = dbContext;
        }

        /// <summary>
        /// Process all pending object changes before they are written to the database.
        /// </summary>
        private void ProcessChanges()
        {
            // https://www.exceptionnotfound.net/entity-change-tracking-using-dbcontext-in-entity-framework-6/
            try
            {
                var addedEntities = DbContext.ChangeTracker.Entries()
                    .Where(p => p.State == EntityState.Added).ToList();

                var modifiedEntities = DbContext.ChangeTracker.Entries()
                    .Where(p => p.State == EntityState.Modified).ToList();

                var now = DateTime.UtcNow;

                foreach (var change in modifiedEntities)
                {
                    var entityName = change.Entity.GetType().Name;
                    var primaryKey = change.CurrentValues["Id"];

                    foreach(var prop in change.OriginalValues.Properties)
                    {
                        var originalValue = change.GetDatabaseValues().GetValue<object>(prop);
                        var originalValueString = originalValue?.ToString();

                        var currentValue  = change.CurrentValues[prop];
                        var currentValueString = currentValue?.ToString();

                        if (originalValueString != currentValueString)
                        {
                            // process changed properties
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"ModelReliefDbContext.SaveChanges : {ex.Message}");
            }
        }

        /// <summary>
        /// Save database changes asynchronously.
        /// </summary>
        /// <param name="cancellationToken">Token to allow operation to be cancelled.</param>
        /// <returns>Number of state entries written to the database.</returns>
        public async Task<int> PersistChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            ProcessChanges();
            return await DbContext.SaveChangesAsync();
        }

        /// <summary>
        /// Save database changes synchronously.
        /// </summary>
        /// <returns>Number of state entries written to the database.</returns>
        public int PersistChanges()
        {
            ProcessChanges();
            return DbContext.SaveChanges();
        }
    }
}
