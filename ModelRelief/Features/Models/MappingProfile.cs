// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using FluentValidation;
using ModelRelief.Domain;
using System;
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
    public class Model3dValidator : AbstractValidator<Dto.Model3d>
    {

        public Model3dValidator()
        {
            RuleFor(m => m.Name).NotNull().MinimumLength(4).WithMessage("The Name property is required..");
            RuleFor(m => m.Description).MinimumLength(4).WithMessage("The Description must be more than four characters..");
            RuleFor(m => m.Format).NotEmpty().WithMessage("The file format is not valid.");
        }
    }
}

namespace ModelRelief.Features.ModelsBaseline
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
            {
                CreateMap<Domain.Model3d, Dto.Model3d>().ReverseMap();
            }
    }
}
