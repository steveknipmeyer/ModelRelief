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

namespace ModelRelief.Models
{
    public class ModelReliefEntity
    {
        [Key]
        [Required]   
        public int Id { get; set; }

        // These properties are common to all models. They are marked virtual so that the Display attribute can be set on a per-model basis.
        // https://stackoverflow.com/questions/12735757/mvc-4-data-annotations-display-attribute
        [Required]
        public virtual string Name { get; set; }
        public virtual string Description { get; set; }

        // Navigation Properties
        public User User { get; set; }
    }

    public interface IFileResource
    {
        string Path { get; set; }
    }
}
