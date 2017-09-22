// ------------------------------------------------------------------------// 
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

namespace ModelRelief.Entitities
    {
    public enum MeshFormat
        {
        None,           // unknown
        OBJ,            // Wavefront OBJ
        STL             // Stereolithography
        }

    public class Mesh  : ModelReliefResource
    {
        [Required, Display (Name = "Mesh Name")]
        [MaxLength(64)]
        public string Name { get; set; }

        public MeshFormat Format { get; set; }
       
        public string Path { get; set; }

        public Mesh()
        {
        }

        public Mesh(int id, string name, MeshFormat format, string path)
        {
            Id     = id;
            Name   = name;
            Format = format;
            Path   = path;
        }
    }
}
