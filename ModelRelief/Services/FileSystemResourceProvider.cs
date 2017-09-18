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
using ModelRelief.Utility;

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
    /// File system resource provider.
    /// </summary>
    class FileSystemResourceProvider {

        const string ModelsFolder       = @"models\";
        const string DepthBuffersFolder = @"depthbuffers\";
        const string MeshesFolder       = @"meshes\";

        private ResourceType         _resourceType;
        private IHttpContextAccessor _httpContext;
        private IHostingEnvironment  _hostingEnvironment;

        /// <summary>
        /// Constructor.
        /// </summary>
        public FileSystemResourceProvider(ResourceType resourceType, IHttpContextAccessor httpContext, IHostingEnvironment hostingEnvironment)
            {
            _resourceType       = resourceType;
            _httpContext        = httpContext;
            _hostingEnvironment = hostingEnvironment;
            }

        /// <summary>
        /// Returns the default folder for a given resource type.
        /// </summary>
        /// <returns>Default folder</returns>
        public string DefaultFolder {
            get 
            {
                string resourcePath = "";    
                switch(_resourceType)
                {
                    case ResourceType.Model:
                        resourcePath =  ModelsFolder;
                        break;

                    case ResourceType.DepthBuffer:
                        resourcePath =  DepthBuffersFolder;
                        break;

                    case ResourceType.Mesh:
                        resourcePath =  MeshesFolder;
                        break;

                    default:
                        {
                            var ex = new Exception($"Invalid resource type: {_resourceType}");
                            throw ex;
                        }
                }
                var rootPath = _hostingEnvironment.WebRootPath;
                var defaulFolder = $@"{rootPath}\store\users\{UserId}\{resourcePath}";
                return defaulFolder;
            }
        }
        /// <summary>
        /// Returns the current user ID.
        /// </summary>
        /// <returns>User ID</returns>
        public string UserId {
            get
            {
                return _httpContext.HttpContext.User.GetUserId();
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
}
