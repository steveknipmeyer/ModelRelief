// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using ModelRelief.Domain;
using System.ComponentModel.DataAnnotations;

namespace ModelRelief.Features.Models
{
    public class Model3dEditViewModel
        {
        [Required, Display (Name = "Model Name")]
        [MaxLength(64)]
        public string Name { get; set; }

        [Required]
        [MaxLength(64)]
        public string Description { get; set; }

        public Model3dFormat Format { get; set; }
        }
    }
