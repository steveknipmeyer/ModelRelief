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

using ModelRelief.Entities;

namespace ModelRelief.Entities
{
    public class Project : ModelReliefEntity
    {
        [Required, Display (Name = "Project Name")]
        public string Name { get; set; }
        public string Description { get; set; }

        // Navigation Properties
        public User User { get; set; }

        /// <summary>
        /// Default constructor.
        /// </summary>
        public Project()
        {
        }
    }
}
