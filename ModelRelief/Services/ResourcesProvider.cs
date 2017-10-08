// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using ModelRelief.Models;

namespace ModelRelief.Services
{
    /// <summary>
    /// Interface for a generic resource.
    /// </summary>
    public interface IResourceProvider<TResource> 
        where TResource : ModelReliefEntity

    {
        IEnumerable<TResource> GetAll();
        TResource Find (int id);
        TResource Add (TResource model);
        TResource Update (TResource model);
        void Delete (int id);

        void Commit ();
    }

    /// <summary>
    /// Interface for locating resources.
    /// </summary>
    public interface IResourcesProvider
    
    {
        IResourceProvider<Model3d>      Models {get;}
        IResourceProvider<DepthBuffer>  DepthBuffers {get;}
        IResourceProvider<Mesh>         Meshes {get;}
    }
}
