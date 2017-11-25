// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using FluentValidation;
using ModelRelief.Api.V2.Shared.Rest;
using ModelRelief.Domain;
using System.ComponentModel.DataAnnotations;

namespace ModelRelief.Dto
{
    public class Model3d : IGetModel
    {
        public int Id { get; set; }

        [Display (Name = "Model Name")]
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
            RuleFor(m => m.Name)
                .NotNull().WithMessage("The Name property must be defined.");

            RuleFor(m => m.Description)
                .NotNull().WithMessage("The Description property is required.")
                .MinimumLength(3).WithMessage("The Description must be three or more characters.");

            RuleFor(m => m.Format)
                .NotEmpty().WithMessage("The file format must be provided.");
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
