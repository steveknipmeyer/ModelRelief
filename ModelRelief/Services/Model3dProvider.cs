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
        private FileSystemResourceProvider  _fileSystemHelper;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="databaseContext">Database context.</param>
        public SqlModel3dProvider(ModelReliefDbContext databaseContext, IHttpContextAccessor httpContextAccessor, IHostingEnvironment hostingEnvironment)
        {
            _databaseContext    = databaseContext;
            _httpContext        = httpContextAccessor;
            _hostingEnvironment = hostingEnvironment;

            _fileSystemHelper = new FileSystemResourceProvider(ResourceType.Model, httpContextAccessor, hostingEnvironment);
        }

        /// <summary>
        /// Return all models.
        /// </summary>
        /// <returns>Collection of all models.</returns>
        public IEnumerable<Model3d> GetAll()
        {   
            string userId = _fileSystemHelper.UserId;    
            return _databaseContext.Models;
        }

        /// <summary>
        /// Find a specific model by Id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Model with the target ID.</returns>
        public Model3d Find(string id)
        {
            var defaultFolder = _fileSystemHelper.DefaultFolder;    
            int modelId = Convert.ToInt32(id);
            return _databaseContext.Models.FirstOrDefault (m => m.Id == modelId);
        }

        /// <summary>
        /// Add a new model.
        /// </summary>
        /// <param name="newModel"></param>
        /// <returns>Newly-added model.</returns>
        public Model3d Add(Model3d newModel)
        {
            _databaseContext.Add (newModel);
            _databaseContext.SaveChanges();
            return newModel;
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
