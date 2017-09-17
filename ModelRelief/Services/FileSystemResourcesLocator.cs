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
    /// System resources.
    /// </summary>
    enum ResourceType {

        Model,
        DepthBuffer,
        Mesh
    }

    class FileSystemResourceLocator {

        const string ModelsFolder       = "models/";
        const string DepthBuffersFolder = "depthbuffers/";
        const string MeshesFolder       = "meshes/";
        
        public FileSystemResourceLocator()
            {
            }

        public IEnumerable<Model3d> GetAll()
            {
            return null;
            }

        public Model3d Find(int id)
            {
            return null;
            }

        public Model3d Add(Model3d newModel)
            {
            return null;
            }

        public void Commit()
            {
            }
    }

    /// <summary>
    /// File system implementation of IResourcesLocator.
    /// </summary>
    public class FileSystemResourcesLocator : IResourcesLocator
    {
        
        private IResourceLocator<Model3d> _modelLocator;

        /// <summary>
        /// Constructor
        /// </summary>
        public FileSystemResourcesLocator()
        {
            _modelLocator = null;
        }

        /// <summary>
        /// Returns the Model3d locator.
        /// </summary>
        /// <returns>IModel3d locator</returns>
        public IResourceLocator<Model3d> Models
        {
            get { return _modelLocator; }
        }
    }           
}
