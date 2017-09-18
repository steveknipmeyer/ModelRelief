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

    /// <summary>
    /// File system resource helper.
    /// </summary>
    class FileSystemResourceHelper {

        const string ModelsFolder       = "models/";
        const string DepthBuffersFolder = "depthbuffers/";
        const string MeshesFolder       = "meshes/";

        ResourceType _resourceType;

        /// <summary>
        /// Constructor.
        /// </summary>
        public FileSystemResourceHelper(ResourceType resourceType)
            {
            _resourceType = resourceType;
            }

        /// <summary>
        /// Returns the default folder for a given resource type.
        /// </summary>
        /// <returns></returns>
        string DefaultFolder {
            get 
            {
                switch(_resourceType)
                {
                    case ResourceType.Model:
                        return ModelsFolder;

                    case ResourceType.DepthBuffer:
                        return DepthBuffersFolder;

                    case ResourceType.Mesh:
                        return MeshesFolder;

                    default:
                        return "";                        
                }
            }
        }

        /// <summary>
        /// Return all files.
        /// </summary>
        /// <returns></returns>
        public IEnumerable<string> GetAll()
            {
            return null;
            }

        /// <summary>
        /// Find the path of a given file.
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns>File path.</returns>
        public string Find(string fileName)
            {
            return null;
            }

        /// <summary>
        /// Adds a given stream as the named file.
        /// </summary>
        /// <param name="fileName">File name to create.</param>
        /// <param name="stream">Stream.</param>
        /// <returns>True/False success for file creation.</returns>
        public bool Add(string fileName, System.IO.Stream stream)
            {
            return false;
            }
    }

    /// <summary>
    /// File system implementation of IResourcesProvider.
    /// </summary>
    public class FileSystemResourcesProvider : IResourcesProvider
    {   
        private IResourceProvider<Model3d> _modelProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        public FileSystemResourcesProvider()
        {
            _modelProvider = null;
        }

        /// <summary>
        /// Returns the Model3d provider.
        /// </summary>
        /// <returns>IModel3d provider</returns>
        public IResourceProvider<Model3d> Models
        {
            get { return _modelProvider; }
        }
    }           
}
