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
    public class Project : ModelReliefEntity
    {
        [Required, Display (Name = "Project Name")]
        public override string Name { get; set; }
        public override string Description { get; set; }

        // Navigation Properties

        /// <summary>
        /// Default constructor.
        /// </summary>
        public Project()
        {
        }
    }
}
