﻿// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

using ModelRelief.Services;

namespace ModelRelief.Entities
    {
    public enum MeshFormat
        {
        None,           // unknown
        OBJ,            // Wavefront OBJ
        STL             // Stereolithography
        }

    public class Mesh  : ModelReliefEntity
    {
        [Required, Display (Name = "Mesh Name")]
        [MaxLength(256)]
        public string Name { get; set; }

        [MaxLength(256)]
        public string Description { get; set; }

        public MeshFormat Format { get; set; }
       
        public string Path { get; set; }

        public Mesh()
        {
        }
    }
}
