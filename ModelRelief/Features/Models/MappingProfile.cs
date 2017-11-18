﻿// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using ModelRelief.Domain;
using System.ComponentModel.DataAnnotations;

namespace ModelRelief.Dto
{
    public class Model3d
    {
        public int Id { get; set; }

        [Required, Display (Name = "Model Name")]
        public string Name { get; set; }
        public string Description { get; set; }

        public Model3dFormat Format { get; set; }
        public string Path { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Dto.Project Project { get; set; }

        public int? CameraId { get; set; }
        public Dto.Camera Camera { get; set; }
    }
}

namespace ModelRelief.Features.Models
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
            {
            CreateMap<Domain.Model3d, Dto.Model3d>().ReverseMap();

            CreateMap<Domain.Model3d, Model3dEditViewModel>().ReverseMap();
            }
    }
}
