// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using FluentValidation;
using ModelRelief.Api.V1.Shared.Rest;
using System.ComponentModel.DataAnnotations;

namespace ModelRelief.Dto
{
    public class MeshTransform: IIdModel
    {
        public int Id { get; set; }

        [Required, Display (Name = "MeshTransform Name")]
        public string Name { get; set; }
        public string Description { get; set; }

        public double Depth { get; set; }
        public double Width { get; set; }

        public double Tau { get; set; }
        public double SigmaGaussianBlur { get; set; }
        public double SigmaGaussianSmooth { get; set; }
        public double LambdaLinearScaling { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Dto.Project Project { get; set; }
    }

    public class MeshTransformValidator : AbstractValidator<Dto.MeshTransform>
    {
        public MeshTransformValidator()
        {
            RuleFor(m => m.Name)
                .NotNull().WithMessage("The Name property is required.");
         
            RuleFor(m => m.Description)
                .NotNull().WithMessage("The Description property is required.");
        }
    }
}

namespace ModelRelief.Features.Meshtransforms
    {
        public class MappingProfile : Profile
    {
        public MappingProfile() 
        {
        CreateMap<Domain.MeshTransform, Dto.MeshTransform>().ReverseMap();
        }
    }
}
