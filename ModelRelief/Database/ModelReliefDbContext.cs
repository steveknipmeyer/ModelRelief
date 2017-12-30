// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ModelRelief.Domain;
using System;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace ModelRelief.Database
{
    public class ModelReliefDbContext : IdentityDbContext<ApplicationUser>
        {
        public ModelReliefDbContext (DbContextOptions options) : base (options)
        {
        }

        public DbSet<Camera> Cameras
            { get ; set; }

        public DbSet<DepthBuffer> DepthBuffers
            { get ; set; }

        public DbSet<Mesh> Meshes
            { get ; set; }

        public DbSet<MeshTransform> MeshTransforms
            { get ; set; }

        public DbSet<Model3d> Models 
            { get ; set; }

        public DbSet<Project> Projects
            { get ; set; }


        // https://stackoverflow.com/questions/34768976/specifying-on-delete-no-action-in-entity-framework-7
        protected override void OnModelCreating(ModelBuilder modelbuilder)
        {
            foreach (var relationship in modelbuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.SetNull;
            }

            base.OnModelCreating(modelbuilder);
        }

        /// <summary>
        /// Process all pending object changes before they are written to the database.
        /// </summary>
        private void ProcessChanges()
        {
            // https://www.exceptionnotfound.net/entity-change-tracking-using-dbcontext-in-entity-framework-6/
            try
            {
                var addedEntities = ChangeTracker.Entries()
                    .Where(p => p.State == EntityState.Added).ToList();

                var modifiedEntities = ChangeTracker.Entries()
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
                            // create the change log
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
        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            ProcessChanges();
            return await base.SaveChangesAsync();
        }

        /// <summary>
        /// Save database changes synchronously.
        /// </summary>
        /// <returns>Number of state entries written to the database.</returns>
        public override int SaveChanges()
        {
            ProcessChanges();
            return base.SaveChanges();
        }

#region Dynamic DbSet<T>   
// https://stackoverflow.com/questions/33940507/find-a-generic-dbset-in-a-dbcontext-dynamically

        public dynamic GetDbSetByModelName(string name) 
            {
                switch (name) {
                    case "Model3d": 
                        return Models;

                    default:
                        return null;
                }
            }

            public dynamic GetDbSetByReflection(string fullname)
            {
                Type targetType = Type.GetType(fullname);
                var model = GetType()
                    .GetRuntimeProperties()
                    .Where(o => 
                     // https://stackoverflow.com/questions/39169231/isgenerictype-isvaluetype-missing-from-net-core
                     // o.PropertyType.IsGenericType &&
                        o.PropertyType.GetGenericTypeDefinition() == typeof(DbSet<>) &&
                        o.PropertyType.GenericTypeArguments.Contains(targetType))
                    .FirstOrDefault();

                if (null != model)
                    return model.GetValue(this);

                return null;
            }        
#endregion            
        }          
   }
