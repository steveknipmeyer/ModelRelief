// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using ModelRelief.Domain;
using Microsoft.EntityFrameworkCore;

namespace ModelRelief.Services
{
    /// <summary>
    /// Interface for a generic model.
    /// </summary>
    public interface IModelProvider<TModel> 
        where TModel : ModelReliefModel
    {
        IEnumerable<TModel> GetAll();
        TModel Find (int id);
        TModel Add (TModel model);
        TModel Update (TModel model);
        void Delete (int id);

        void Commit ();
    }

    /// <summary>
    /// Interface for locating models.
    /// </summary>
    public interface IModelsProvider
    
    {
        IModelProvider<Model3d>      Model3ds {get;}
        IModelProvider<DepthBuffer>  DepthBuffers {get;}
        IModelProvider<Mesh>         Meshes {get;}
    }
}
