// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using ModelRelief.Entitities;

namespace ModelRelief.Services
{
    /// <summary>
    /// SQL implementation of IResourcesProvider.
    /// </summary>
    public class SqlResourcesProvider : IResourcesProvider
    {
        private ModelReliefDbContext        _context;
        private IResourceProvider<Model3d>   _modelProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="context">Database context.</param>
        public SqlResourcesProvider(ModelReliefDbContext context)
        {
            _context      = context;
            _modelProvider = (new SqlModel3dProvider(_context)) as IResourceProvider<Model3d>;
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
