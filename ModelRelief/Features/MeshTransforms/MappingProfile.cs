// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using ModelRelief.Domain;
using System.ComponentModel.DataAnnotations;

namespace ModelRelief.Dto
{
    public class MeshTransform
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
