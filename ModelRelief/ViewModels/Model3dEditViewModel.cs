﻿// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

using ModelRelief.Entitities;

namespace ModelRelief.ViewModels
    {
    public class Model3dEditViewModel
        {
        [Required, Display (Name = "Model Name")]
        [MaxLength(64)]
        public string Name { get; set; }

        public Format3d Format { get; set; }
        }
    }
