// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using ModelRelief.Domain;
using System.ComponentModel.DataAnnotations;

namespace ModelRelief.ViewModels
{
    public class Model3dEditViewModel
        {
        [Required, Display (Name = "Model Name")]
        [MaxLength(64)]
        public string Name { get; set; }

        public Model3dFormat Format { get; set; }
        }
    }
