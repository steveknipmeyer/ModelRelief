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

using ModelRelief.Domain;

namespace ModelRelief.Domain
{
    public class MeshTransform : ModelReliefModel
    {
        [Required, Display (Name = "Mesh Transform Name")]
        public override string Name { get; set; }
        
        public double Depth { get; set; }
        public double Width { get; set; }

        public double Tau { get; set; }
        public double SigmaGaussianBlur { get; set; }
        public double SigmaGaussianSmooth { get; set; }
        public double LambdaLinearScaling { get; set; }

        // Navigation Properties
        public Project Project { get; set; }

        /// <summary>
        /// Default constructor.
        /// </summary>
        public MeshTransform()
        {
        }
    }
}
