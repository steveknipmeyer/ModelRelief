// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

using ModelRelief.Domain;
using ModelRelief.Services;

namespace ModelRelief.Domain
{
    [DependentFiles(nameof(Mesh))]
    public class MeshTransform : DomainModel
    {       
        [DependentFileProperty]
        public double Depth { get; set; }
        [DependentFileProperty]
        public double Width { get; set; }

        [DependentFileProperty]
        public double Tau { get; set; }
        [DependentFileProperty]
        public double SigmaGaussianBlur { get; set; }
        [DependentFileProperty]
        public double SigmaGaussianSmooth { get; set; }
        [DependentFileProperty]
        public double LambdaLinearScaling { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Project Project { get; set; }

        /// <summary>
        /// Default constructor.
        /// </summary>
        public MeshTransform()
        {
        }
    }
}
