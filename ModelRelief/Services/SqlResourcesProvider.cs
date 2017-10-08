// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Models;

namespace ModelRelief.Services
{
#region Dynamic DbSet<T>    
// https://stackoverflow.com/questions/33940507/find-a-generic-dbset-in-a-dbcontext-dynamically

    public class SqlResourceProvider<TResource> : IResourceProvider<TResource>  
        where TResource: ModelReliefEntity
    {
        private ModelReliefDbContext        _databaseContext;
        private IHttpContextAccessor        _httpContext;
        private IHostingEnvironment         _hostingEnvironment;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="databaseContext">Database context.</param>
        public SqlResourceProvider(ModelReliefDbContext databaseContext, IHttpContextAccessor httpContextAccessor, IHostingEnvironment hostingEnvironment)
        {
            _databaseContext    = databaseContext;
            _httpContext        = httpContextAccessor;
            _hostingEnvironment = hostingEnvironment;
        }

        /// <summary>
        /// Returns the DbSet<T> for the generic type.
        /// </summary>
        /// <returns>DbSet<T></returns>
        private DbSet<TResource> DbSet
        {
            get
            {
                Type t = typeof(TResource);
                DbSet<TResource> dbSet = _databaseContext.GetDbSetByReflection(t.FullName);
                return dbSet;
            }
        }

        /// <summary>
        /// Return all resources.
        /// </summary>
        /// <returns>Collection of all resources.</returns>
        public IEnumerable<TResource> GetAll()
        {   
            return this.DbSet;
        }

        /// <summary>
        /// Find a specific resource by Id.
        /// </summary>
        /// <param name="id">Id of resource</param>
        /// <returns>Resource with the target ID.</returns>
        public TResource Find(int id)
        {
            return this.DbSet.FirstOrDefault (m => m.Id == id);
        }

        /// <summary>
        /// Add a new resource.
        /// </summary>
        /// <param name="newResource"></param>
        /// <returns>New resource.</returns>
        public TResource Add(TResource newResource)
        {
            if (newResource == null)
                return null;

            _databaseContext.Add (newResource);
            Commit();
            return newResource;
        }

        /// <summary>
        /// Updates a resource.
        /// </summary>
        /// <param resource>resource to update</param>
        /// <returns>Updated resource.</returns>
        public TResource Update(TResource resource)
        {
            if (resource == null)
                return null;

            _databaseContext.Update(resource);
            Commit();           
            return resource;
        }

        /// <summary>
        /// Deletes a resource.
        /// </summary>
        /// <param id>Id of resource to delete</param>
        public void Delete(int id)
        {
            TResource resource = this.DbSet.FirstOrDefault (m => m.Id == id);
            if (resource == null)
                return;

            _databaseContext.Remove(resource);
            Commit();
        }

        /// <summary>
        /// Commit all pending changes.
        /// </summary>
        public void Commit()
        {
            _databaseContext.SaveChanges();
        }
    }

#endregion

    /// <summary>
    /// SQL implementation of IResourcesProvider.
    /// </summary>
    public class SqlResourcesProvider : IResourcesProvider
    {
        private IResourceProvider<Model3d>      _modelProvider;
        private IResourceProvider<DepthBuffer>  _depthBufferProvider;
        private IResourceProvider<Mesh>         _meshProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="databaseContext">Database context.</param>
        public SqlResourcesProvider(ModelReliefDbContext databaseContext, IHttpContextAccessor httpContextAccessor, IHostingEnvironment hostingEnvironment)
        {
            _modelProvider       = (new SqlResourceProvider<Model3d>(databaseContext, httpContextAccessor, hostingEnvironment)) as IResourceProvider<Model3d>;
            _depthBufferProvider = (new SqlResourceProvider<DepthBuffer>(databaseContext, httpContextAccessor, hostingEnvironment)) as IResourceProvider<DepthBuffer>;
            _meshProvider        = (new SqlResourceProvider<Mesh>(databaseContext, httpContextAccessor, hostingEnvironment)) as IResourceProvider<Mesh>;
        }

        /// <summary>
        /// Returns the Model3d provider.
        /// </summary>
        /// <returns>Model3d provider</returns>
        public IResourceProvider<Model3d> Models
        {
            get { return _modelProvider; }
        }

        /// <summary>
        /// Returns the DepthBuffer provider.
        /// </summary>
        /// <returns>DepthBuffer provider</returns>
        public IResourceProvider<DepthBuffer> DepthBuffers
        {
            get { return _depthBufferProvider; }
        }

        /// <summary>
        /// Returns the Mesh provider.
        /// </summary>
        /// <returns>Mesh provider</returns>
        public IResourceProvider<Mesh> Meshes
        {
            get { return _meshProvider; }
        }
    }        
}
