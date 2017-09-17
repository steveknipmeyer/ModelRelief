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
    /// Interface for a generic resource.
    /// </summary>
    public interface IResourceLocator<TResource> 
    {
    IEnumerable<TResource> GetAll();
    TResource Find (int id);

    TResource Add (TResource model);
    void Commit ();
    }

    /// <summary>
    /// Interface for locating resources.
    /// </summary>
    public interface IResourcesLocator
    {
        IResourceLocator<Model3d>  Models {get;}
    }
}
