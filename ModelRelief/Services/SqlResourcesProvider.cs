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

using ModelRelief.Entitities;

namespace ModelRelief.Services
{
    /// <summary>
    /// SQL implementation of IResourcesProvider.
    /// </summary>
    public class SqlResourcesProvider : IResourcesProvider
    {
        private IResourceProvider<Model3d>  _modelProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="databaseContext">Database context.</param>
        public SqlResourcesProvider(ModelReliefDbContext databaseContext, IHttpContextAccessor httpContextAccessor, IHostingEnvironment hostingEnvironment)
        {
            _modelProvider = (new SqlModel3dProvider(databaseContext, httpContextAccessor, hostingEnvironment)) as IResourceProvider<Model3d>;
        }

        /// <summary>
        /// Returns the Model3dProvider.
        /// </summary>
        /// <returns>IModel3d provider</returns>
        public IResourceProvider<Model3d> Models
        {
            get { return _modelProvider; }
        }
    }        
}
