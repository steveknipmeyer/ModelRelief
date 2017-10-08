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
    public class MeshTransform : ModelReliefEntity
    {
        [Required, Display (Name = "Mesh Transform Name")]
        public string Name { get; set; }
        public string Description { get; set; }
        
        public float Depth { get; set; }
        public float Width { get; set; }

        public float Tau { get; set; }
        public float SigmaGaussianBlur { get; set; }
        public float SigmaGaussianSmooth { get; set; }
        public float LambdaLinearScaling { get; set; }

        // Navigation Properties
        public User User { get; set; }
        public Project Project { get; set; }

        /// <summary>
        /// Default constructor.
        /// </summary>
        public MeshTransform()
        {
        }
    }
}
