// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using ModelRelief.Domain;
using System.ComponentModel.DataAnnotations;

namespace ModelRelief.Domain
{
    public abstract class ModelReliefModel
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
        public ApplicationUser User { get; set; }
    }

    public interface IFileResource
    {
        string Path { get; set; }
    }
}
