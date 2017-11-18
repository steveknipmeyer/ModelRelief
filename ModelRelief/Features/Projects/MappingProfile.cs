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
    public class Project
    {
        public int Id { get; set; }

        [Required, Display (Name = "Project Name")]
        public string Name { get; set; }
        public string Description { get; set; }
    }
}

namespace ModelRelief.Features.Projects
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
        {
        CreateMap<Domain.Project, Dto.Project>().ReverseMap();
        }
    }
}
