
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

namespace ModelRelief.Entities
{
    public enum DepthBufferFormat
    {
        None,       // unknown
        Raw,        // floating point array
        PNG,        // PNG format
        JPG         // JPG format
    }

    public class DepthBuffer  : ModelReliefEntity
        {       
        [Required, Display (Name = "DepthBuffer Name")]
        [MaxLength(64)]
        public string Name { get; set; }

        public DepthBufferFormat Format { get; set; }
        
        public string Path { get; set; }

        public DepthBuffer()
        {
        }

        public DepthBuffer(int id, string name, DepthBufferFormat format, string path)
        {
            Id     = id;
            Name   = name;
            Format = format;
            Path   = path;
        }
    }
}
