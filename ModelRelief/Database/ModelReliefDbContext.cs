// -----------------------------------------------------------------------
// <copyright file="ModelReliefDbContext.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Database
{
    using System;
    using System.Linq;
    using System.Reflection;
    using Microsoft.EntityFrameworkCore;
    using ModelRelief.Domain;

    public class ModelReliefDbContext : DbContext
        {
        public ModelReliefDbContext(DbContextOptions options)
            : base(options)
        {
        }

        public DbSet<Camera> Cameras
            { get; set; }

        public DbSet<DepthBuffer> DepthBuffers
            { get; set; }

        public DbSet<Mesh> Meshes
            { get; set; }

        public DbSet<MeshTransform> MeshTransforms
            { get; set; }

        public DbSet<Model3d> Models
            { get; set; }

        public DbSet<Project> Projects
            { get; set; }

        // https://stackoverflow.com/questions/34768976/specifying-on-delete-no-action-in-entity-framework-7
        protected override void OnModelCreating(ModelBuilder modelbuilder)
        {
            foreach (var relationship in modelbuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.SetNull;
            }

            base.OnModelCreating(modelbuilder);
        }

#region Dynamic DbSet<T>
// https://stackoverflow.com/questions/33940507/find-a-generic-dbset-in-a-dbcontext-dynamically

        public dynamic GetDbSetByModelName(string name)
            {
                switch (name)
                {
                    case "Model3d":
                        return Models;

                    default:
                        return null;
                }
            }

        public dynamic GetDbSetByReflection(string fullname)
        {
            Type targetType = Type.GetType(fullname);
            PropertyInfo property = this.GetType()
                .GetRuntimeProperties()
                .Where(p =>
                    // https://stackoverflow.com/questions/39169231/isgenerictype-isvaluetype-missing-from-net-core
                    // o.PropertyType.IsGenericType &&
                    p.PropertyType.GetGenericTypeDefinition() == typeof(DbSet<>) &&
                    p.PropertyType.GenericTypeArguments.Contains(targetType))
                .FirstOrDefault();

            if (property != null)
                return property.GetValue(this);

            return null;
        }
#endregion
        }
   }
