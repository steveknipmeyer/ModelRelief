// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using ModelRelief.Domain;
using System.ComponentModel.DataAnnotations;
using System;
using FluentValidation;

namespace ModelRelief.Dto
{
        public class Mesh
        {
            public int Id { get; set; }

            [Required, Display (Name = "Mesh Name")]
            public string Name { get; set; }
            public string Description { get; set; }

            public MeshFormat Format { get; set; }
            public string Path { get; set; }

            // Navigation Properties
            public int? ProjectId { get; set; }
            public Dto.Project Project { get; set; }

            public int? CameraId { get; set; }
            public Dto.Camera Camera { get; set; }

            public int? DepthBufferId { get; set; }
            public Dto.DepthBuffer DepthBuffer { get; set; }

            public int? MeshTransformId { get; set; }
            public Dto.MeshTransform MeshTransform { get; set; }
        }

        public class MeshValidator : AbstractValidator<Mesh>
        {
            public MeshValidator()
            {
            RuleFor(m => m.Name).NotNull().MinimumLength(4).WithMessage("The Name property is required..");
            RuleFor(m => m.Description).MinimumLength(4).WithMessage("The Description must be more than four characters..");
            RuleFor(m => m.Format).NotEmpty().WithMessage("The file format is not valid.");
            }
    }
}

namespace ModelRelief.Features.Meshes
{

    public class MappingProfile : Profile
    {
        public MappingProfile() 
        {
            CreateMap<Domain.Mesh, Dto.Mesh>().ReverseMap();
        }
    }
}
