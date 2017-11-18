// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using FluentValidation.Attributes;
using ModelRelief.Domain;
using System.ComponentModel.DataAnnotations;

namespace ModelRelief.Dto
{
    public class Camera
    {
        public int Id { get; set; }

        [Required, Display (Name = "Camera Name")]
        public string Name { get; set; }
        public string Description { get; set; }

        public StandardView StandardView { get; set; }

        public double PositionX { get; set; }
        public double PositionY { get; set; }
        public double PositionZ { get; set; }

        public double LookAtX { get; set; }
        public double LookAtY { get; set; }
        public double LookAtZ { get; set; }

        public double Near{ get; set; }
        public double Far{ get; set; }
        public double FieldOfView { get; set; }
        public bool BoundClippingPlanes { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Dto.Project Project { get; set; }
    }
}

namespace ModelRelief.Features.Cameras
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
        {
        CreateMap<Domain.Camera, Dto.Camera>().ReverseMap();
        }
    }
}
