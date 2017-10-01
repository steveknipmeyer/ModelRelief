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

namespace ModelRelief.Entities
{
    public class Vector3d : ModelReliefEntity
    {
        [Required, Display (Name = "Vector3d Name")]
        [MaxLength(256)]
        public string Name { get; set; }

        [MaxLength(256)]
        public string Description { get; set; }

        /// <summary>
        /// Default constructor.
        /// </summary>
        public Vector3d()
        {
        }
    }
}
