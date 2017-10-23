﻿
// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

using ModelRelief.Models;

namespace ModelRelief.Models
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
        public override string Name { get; set; }
        public override string Description { get; set; }

        public DepthBufferFormat Format { get; set; }
        public string Path { get; set; }

        // Navigation Properties
        public Project Project { get; set; }
        public Model3d Model { get; set; }
        public Camera Camera { get; set; }

        public DepthBuffer()
        {
        }
    }
}
