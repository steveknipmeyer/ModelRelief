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
    /// SQL implementation of IResourcesLocator.
    /// </summary>
    public class SqlResourcesLocator : IResourcesLocator
    {
        private ModelReliefDbContext        _context;
        private IResourceLocator<Model3d>   _modelLocator;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="context">Database context.</param>
        public SqlResourcesLocator(ModelReliefDbContext context)
        {
            _context      = context;
            _modelLocator = (new SqlModel3dLocator(_context)) as IResourceLocator<Model3d>;
        }

        /// <summary>
        /// Returns the Model3dLocator.
        /// </summary>
        /// <returns>IModel3d locator</returns>
        public IResourceLocator<Model3d> Models
        {
            get { return _modelLocator; }
        }
    }        
}
