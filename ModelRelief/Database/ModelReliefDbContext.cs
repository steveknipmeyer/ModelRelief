// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Domain;
using System;
using System.Linq;
using System.Reflection;

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
