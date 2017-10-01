
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
        [MaxLength(256)]
        public string Name { get; set; }

        [MaxLength(256)]
        public string Description { get; set; }

        public DepthBufferFormat Format { get; set; }
        
        public string Path { get; set; }

        public DepthBuffer()
        {
        }
    }
}
