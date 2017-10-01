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
    public class Project : ModelReliefEntity
    {
        [Required, Display (Name = "Project Name")]
        [MaxLength(256)]
        public string Name { get; set; }

        [MaxLength(256)]
        public string Description { get; set; }

        public string UserId { get;set; }
        
#region Reference Properties
        [ForeignKey(nameof(UserId))]
        public User User { get; set; }
#endregion

        /// <summary>
        /// Default constructor.
        /// </summary>
        public Project()
        {
        }
    }
}
