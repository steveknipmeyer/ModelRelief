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

        // These properties are common to all models. 
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }

        // Navigation Properties
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
    }

    public interface IFileResource
    {
        string Path { get; set; }
    }
}
