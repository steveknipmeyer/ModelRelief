// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Api.V1;
using ModelRelief.Features;
using ModelRelief.Infrastructure;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace ModelRelief.Domain
{
    public enum MeshFormat
        {
        None,           // unknown
        OBJ,            // Wavefront OBJ
        STL             // Stereolithography
        }

    public class Mesh  : ModelReliefModel, IFileResource
    {
        [Required, Display (Name = "Mesh Name")]
        public override string Name { get; set; }
        public override string Description { get; set; }

        public MeshFormat Format { get; set; }      
        public string Path { get; set; }

        // Navigation Properties
        public Project Project { get; set; }
        public DepthBuffer DepthBuffer { get; set; }
        public MeshTransform MeshTransform { get; set; }

        public Camera Camera { get; set; }

        public Mesh()
        {
        }
    }
}
