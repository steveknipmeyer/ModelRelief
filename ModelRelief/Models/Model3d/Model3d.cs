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

namespace ModelRelief.Models
{
    public enum Model3dFormat
    {
        None,           // unknown
        OBJ,            // Wavefront OBJ
        STL             // Stereolithography
    }

    public class Model3d : ModelReliefEntity, IFileResource
    {       
        [Required, Display (Name = "Model Name")]
        public override string Name { get; set; }
        public override string Description { get; set; }

        public Model3dFormat Format { get; set; }
        public string Path { get; set; }

        // Navigation Properties
        public Project Project { get; set; }
        public Camera Camera { get; set; }

        /// <summary>
        /// Default constructor.
        /// </summary>
        public Model3d()
        {
        }
    }
}
