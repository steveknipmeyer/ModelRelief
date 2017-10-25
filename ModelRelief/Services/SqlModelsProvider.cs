// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Database;
using ModelRelief.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ModelRelief.Services
{
    #region Dynamic DbSet<T>    
    // https://stackoverflow.com/questions/33940507/find-a-generic-dbset-in-a-dbcontext-dynamically

    public class SqlModelProvider<TModel> : IModelProvider<TModel>  
        where TModel: ModelReliefModel
    {
        private ModelReliefDbContext        _databaseContext;
        private IHttpContextAccessor        _httpContext;
        private IHostingEnvironment         _hostingEnvironment;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="databaseContext">Database context.</param>
        public SqlModelProvider(ModelReliefDbContext databaseContext, IHttpContextAccessor httpContextAccessor, IHostingEnvironment hostingEnvironment)
        {
            _databaseContext    = databaseContext;
            _httpContext        = httpContextAccessor;
            _hostingEnvironment = hostingEnvironment;
        }

        /// <summary>
        /// Returns the DbSet<T> for the generic type.
        /// </summary>
        /// <returns>DbSet<T></returns>
        private DbSet<TModel> DbSet
        {
            get
            {
                return _databaseContext.Set<TModel>();
            }
        }

        /// <summary>
        /// Return all models.
        /// </summary>
        /// <returns>Collection of all models.</returns>
        public IEnumerable<TModel> GetAll()
        {   
            return this.DbSet.AsEnumerable<TModel>();
        }

        /// <summary>
        /// Find a specific model by Id.
        /// </summary>
        /// <param name="id">Id of model</param>
        /// <returns>Model with the target ID.</returns>
        public TModel Find(int id)
        {
            return this.DbSet.FirstOrDefault (m => m.Id == id);
        }

        /// <summary>
        /// Add a new model.
        /// </summary>
        /// <param name="newModel"></param>
        /// <returns>New model.</returns>
        public TModel Add(TModel newModel)
        {
            if (newModel == null)
                return null;

            _databaseContext.Add (newModel);
            Commit();
            return newModel;
        }

        /// <summary>
        /// Updates a model.
        /// </summary>
        /// <param model>Model to update</param>
        /// <returns>Updated model.</returns>
        public TModel Update(TModel model)
        {
            if (model == null)
                return null;

            _databaseContext.Update(model);
            Commit();           
            return model;
        }

        /// <summary>
        /// Deletes a model.
        /// </summary>
        /// <param id>Id of model to delete</param>
        public void Delete(int id)
        {
            TModel model = this.DbSet.FirstOrDefault (m => m.Id == id);
            if (model == null)
                return;

            _databaseContext.Remove(model);
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
    /// SQL implementation of IModelsProvider.
    /// </summary>
    public class SqlModelsProvider : IModelsProvider
    {
        private IModelProvider<Model3d>      _modelProvider;
        private IModelProvider<DepthBuffer>  _depthBufferProvider;
        private IModelProvider<Mesh>         _meshProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="databaseContext">Database context.</param>
        public SqlModelsProvider(ModelReliefDbContext databaseContext, IHttpContextAccessor httpContextAccessor, IHostingEnvironment hostingEnvironment)
        {
            _modelProvider       = (new SqlModelProvider<Model3d>(databaseContext, httpContextAccessor, hostingEnvironment)) as IModelProvider<Model3d>;
            _depthBufferProvider = (new SqlModelProvider<DepthBuffer>(databaseContext, httpContextAccessor, hostingEnvironment)) as IModelProvider<DepthBuffer>;
            _meshProvider        = (new SqlModelProvider<Mesh>(databaseContext, httpContextAccessor, hostingEnvironment)) as IModelProvider<Mesh>;
        }

        /// <summary>
        /// Returns the Model3d provider.
        /// </summary>
        /// <returns>Model3d provider</returns>
        public IModelProvider<Model3d> Model3ds
        {
            get { return _modelProvider; }
        }

        /// <summary>
        /// Returns the DepthBuffer provider.
        /// </summary>
        /// <returns>DepthBuffer provider</returns>
        public IModelProvider<DepthBuffer> DepthBuffers
        {
            get { return _depthBufferProvider; }
        }

        /// <summary>
        /// Returns the Mesh provider.
        /// </summary>
        /// <returns>Mesh provider</returns>
        public IModelProvider<Mesh> Meshes
        {
            get { return _meshProvider; }
        }
    }        
}
