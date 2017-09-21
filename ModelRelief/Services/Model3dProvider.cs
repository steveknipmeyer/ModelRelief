// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using ModelRelief.Entitities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

using ModelRelief.Services;

namespace ModelRelief.Services
    {
#region SQL        
    public class SqlModel3dProvider : IResourceProvider<Model3d>
    {
        private ModelReliefDbContext        _databaseContext;
        private IHttpContextAccessor        _httpContext;
        private IHostingEnvironment         _hostingEnvironment;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="databaseContext">Database context.</param>
        public SqlModel3dProvider(ModelReliefDbContext databaseContext, IHttpContextAccessor httpContextAccessor, IHostingEnvironment hostingEnvironment)
        {
            _databaseContext    = databaseContext;
            _httpContext        = httpContextAccessor;
            _hostingEnvironment = hostingEnvironment;
        }

        /// <summary>
        /// Return all models.
        /// </summary>
        /// <returns>Collection of all models.</returns>
        public IEnumerable<Model3d> GetAll()
        {   
            return _databaseContext.Models;
        }

        /// <summary>
        /// Find a specific model by Id.
        /// </summary>
        /// <param name="id">Id of model</param>
        /// <returns>Model with the target ID.</returns>
        public Model3d Find(int id)
        {
            return _databaseContext.Models.FirstOrDefault (m => m.Id == id);
        }

        /// <summary>
        /// Add a new model.
        /// </summary>
        /// <param name="newModel"></param>
        /// <returns>New model.</returns>
        public Model3d Add(Model3d newModel)
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
        public Model3d Update(Model3d model)
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
            Model3d model = _databaseContext.Models.FirstOrDefault (m => m.Id == id);
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
    }
